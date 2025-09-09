import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEdit, FaTrash } from "react-icons/fa";
import "../styles/Patient.css";
import patientM from "/assets/patient/patient-m.png";
import patientF from "/assets/patient/patient-f.png";

const base_url = import.meta.env.VITE_PUBLIC_API_URL;

export default function Patient() {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState("");
  const [pageNo, setPageNo] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState(defaultForm());
  const [isEditing, setIsEditing] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [newImageFile, setNewImageFile] = useState(null);

  function defaultForm() {
    return {
      _id: "",
      name: "",
      mobile: "",
      sex: "",
      age: "",
      email: "",
      area: "",
      referraldoctor: { name: "", mobile: "", area: "" },
      referrallab: "",
      height: "",
      materialstatus: "",
      occupation: "",
      pincode: "",
      weight: "",
      image: "",
      bloodgroup: "",
      dateofbirth: "",
      address: "",
    };
  }

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${base_url}/api/admin/patient/getall`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pageno: pageNo,
          sortby: { createdAt: "desc" },
          search,
        }),
      });

      const data = await res.json();
      if (!data.error && data.data) {
        setPatients(data.data.patient || []);
        setTotalPages(data.data.totalPages || 1);
      } else {
        toast.error(data.message || "Failed to fetch patients");
      }
    } catch (err) {
      toast.error("Error fetching patients");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, [pageNo]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes("referraldoctor")) {
      setFormData((p) => ({
        ...p,
        referraldoctor: { ...p.referraldoctor, [name.split(".")[1]]: value },
      }));
    } else {
      setFormData((p) => ({ ...p, [name]: value }));
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !formData._id) return;

    try {
      if (formData.image) {
        await fetch(`${base_url}/api/admin/patient/singleimage`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ _id: formData._id }),
        });
      }

      const formDataUpload = new FormData();
      formDataUpload.append("patientimage", file);

      const res = await fetch(
        `${base_url}/api/admin/patient/upload/${formData._id}`,
        {
          method: "POST",
          body: formDataUpload,
        }
      );

      const data = await res.json();
      if (res.ok && !data.error) {
        toast.success("Image uploaded successfully");
        setFormData((prev) => ({ ...prev, image: data.imageUrl || file.name }));
        fetchPatients();
      } else {
        toast.error(data.message || "Failed to upload image");
      }
    } catch (err) {
      toast.error("Error uploading image");
    }
  };

  const handleImageDelete = async () => {
    if (!formData._id || !formData.image) return;
    try {
      const res = await fetch(`${base_url}/api/admin/patient/singleimage`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _id: formData._id }),
      });

      const data = await res.json();
      if (res.ok && !data.error) {
        toast.success("Image deleted successfully");
        setFormData((prev) => ({ ...prev, image: "" }));
        fetchPatients();
      } else {
        toast.error(data.message || "Failed to delete image");
      }
    } catch (err) {
      toast.error("Error deleting image");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.mobile) {
      toast.error("Name & Mobile are required!");
      return;
    }

    try {
      const url = isEditing
        ? `${base_url}/api/admin/patient/update/${formData._id}`
        : `${base_url}/api/admin/patient/create`;

      const res = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok && !data.error) {
        const savedPatientId = isEditing ? formData._id : data?.data?._id;

        if (newImageFile && savedPatientId) {
          if (formData.image) {
            await fetch(`${base_url}/api/admin/patient/singleimage`, {
              method: "DELETE",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ _id: savedPatientId }),
            });
          }

          const formDataUpload = new FormData();
          formDataUpload.append("patientimage", newImageFile);

          const imgRes = await fetch(
            `${base_url}/api/admin/patient/upload/${savedPatientId}`,
            {
              method: "POST",
              body: formDataUpload,
            }
          );

          const imgData = await imgRes.json();
          if (imgRes.ok && !imgData.error) {
            toast.success("Image uploaded successfully");
          } else {
            toast.error(imgData.message || "Failed to upload image");
          }

          setNewImageFile(null);
        }

        Swal.fire({
          title: "Success!",
          text: `Patient ${isEditing ? "updated" : "registered"} successfully.`,
          icon: "success",
          confirmButtonColor: "#13a4dd",
        });

        setModalOpen(false);
        setFormData(defaultForm());
        setIsEditing(false);
        fetchPatients();
      } else {
        toast.error(data.message || "Operation failed");
      }
    } catch (err) {
      toast.error("Something went wrong!");
    }
  };

  const handleDelete = async (id) => {
    try {
      const confirm = await Swal.fire({
        title: "Are you sure?",
        text: "This action cannot be undone!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete it!",
      });

      if (confirm.isConfirmed) {
        const res = await fetch(`${base_url}/api/admin/patient/delete`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ _id: id }),
        });

        const data = await res.json();
        if (res.ok && !data.error) {
          toast.success("Patient deleted successfully");
          fetchPatients();
        } else {
          toast.error(data.message || "Failed to delete patient");
        }
      }
    } catch {
      toast.error("Error deleting patient");
    }
  };

  const openViewModal = (patient) => {
    setSelectedPatient(patient);
    setViewModalOpen(true);
  };

  return (
    <div className="patients-page">
      <div className="patients-header">
        <h2>Manage Patients</h2>
        <div className="patients-search-wrapper">
          <input
            type="text"
            placeholder="Search patients..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button onClick={() => fetchPatients()}>Search</button>
          <button
            onClick={() => {
              setFormData(defaultForm());
              setIsEditing(false);
              setModalOpen(true);
            }}
          >
            + Add Patient
          </button>
        </div>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="patients-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Mobile</th>
              <th>Age</th>
              <th>Sex</th>
              <th>Email</th>
              <th>Area</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {patients.length > 0 ? (
              patients.map((p) => (
                <tr key={p._id}>
                  <td>
                    <img
                      src={
                        p.image
                          ? p.image
                          : p.sex?.toLowerCase() === "female"
                          ? patientF
                          : patientM
                      }
                      alt={p.name}
                      className="patient-table-img"
                    />
                  </td>
                  <td>{p.name}</td>
                  <td>{p.mobile}</td>
                  <td>{p.age}</td>
                  <td>{p.sex}</td>
                  <td>{p.email}</td>
                  <td>{p.area}</td>
                  <td>
                    <button
                      type="button"
                      className="full-details-button"
                      onClick={() => openViewModal(p)}
                    >
                      View Full Details
                    </button>
                    <FaEdit
                      className="action-btn edit"
                      onClick={() => {
                        const formattedDate = p.dateofbirth
                          ? p.dateofbirth.split("T")[0]
                          : "";
                        const normalizedSex = p.sex ? p.sex.toLowerCase() : "";
                        setFormData({
                          ...p,
                          dateofbirth: formattedDate,
                          sex: normalizedSex,
                        });

                        setIsEditing(true);
                        setModalOpen(true);
                      }}
                    />
                    <FaTrash
                      className="action-btn delete"
                      onClick={() => handleDelete(p._id)}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8">No patients found</td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      <div className="patients-pagination">
        <button disabled={pageNo === 0} onClick={() => setPageNo((p) => p - 1)}>
          Prev
        </button>
        <span>
          Page {pageNo + 1} of {totalPages}
        </span>
        <button
          disabled={pageNo + 1 >= totalPages}
          onClick={() => setPageNo((p) => p + 1)}
        >
          Next
        </button>
      </div>

      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{isEditing ? "Update Patient" : "Register Patient"}</h3>

            <div className="image-edit-section">
              <div className="patient-modal-img-wrapper">
                <div className="patient-img-overlay" />
                <img
                  src={
                    formData.image
                      ? formData.image
                      : formData.sex?.toLowerCase() === "female"
                      ? patientF
                      : patientM
                  }
                  alt="patient"
                  className="patient-modal-img"
                />

                {formData.image && (
                  <FaTrash
                    className="image-delete-btn"
                    onClick={handleImageDelete}
                  />
                )}
              </div>
              <div className="image-edit-btns">
                <label htmlFor="file-input">
                  {formData.image ? "Replace" : "Upload"} Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setNewImageFile(e.target.files[0])}
                />
              </div>
            </div>

            <form onSubmit={handleSubmit} className="patient-form">
              <div className="form-grid">
                {[
                  ["name", "Name", "text"],
                  ["mobile", "Mobile", "text"],
                  ["sex", "Sex", "radio"],
                  ["age", "Age", "number"],
                  ["email", "Email", "email"],
                  ["area", "Area", "text"],
                  ["referrallab", "Referral Lab", "text"],
                  ["height", "Height", "number"],
                  ["materialstatus", "Marital Status", "text"],
                  ["occupation", "Occupation", "text"],
                  ["pincode", "Pincode", "text"],
                  ["weight", "Weight", "number"],
                  ["bloodgroup", "Blood Group", "text"],
                  ["dateofbirth", "DOB", "date"],
                ].map(([n, t, type]) =>
                  n === "sex" ? (
                    <div key={n} className="form-field">
                      <label>{t}</label>
                      <div className="form-radio-group">
                        <label>
                          <input
                            type="radio"
                            name="sex"
                            value="male"
                            checked={formData.sex === "male"}
                            onChange={handleChange}
                          />
                          Male
                        </label>
                        <label>
                          <input
                            type="radio"
                            name="sex"
                            value="female"
                            checked={formData.sex === "female"}
                            onChange={handleChange}
                          />
                          Female
                        </label>
                        <label>
                          <input
                            type="radio"
                            name="sex"
                            value="other"
                            checked={formData.sex === "other"}
                            onChange={handleChange}
                          />
                          Other
                        </label>
                      </div>
                    </div>
                  ) : (
                    <div key={n} className="form-field">
                      <label>{t}</label>
                      <input
                        type={type}
                        name={n}
                        value={formData[n]}
                        onChange={handleChange}
                      />
                    </div>
                  )
                )}

                <textarea
                  name="address"
                  placeholder="Address"
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>

              <h4>Referral Doctor</h4>
              <div className="form-grid">
                {["name", "mobile", "area"].map((f) => (
                  <input
                    key={f}
                    type="text"
                    name={`referraldoctor.${f}`}
                    placeholder={`Doctor ${f}`}
                    value={formData.referraldoctor[f]}
                    onChange={handleChange}
                  />
                ))}
              </div>

              <div className="modal-actions">
                <button type="submit">
                  {isEditing ? "Update" : "Register"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setModalOpen(false);
                    setFormData(defaultForm());
                    setIsEditing(false);
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {viewModalOpen && selectedPatient && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Patient Details</h3>
            <div className="patient-image">
              <img
                src={
                  selectedPatient.image
                    ? selectedPatient.image
                    : selectedPatient.sex?.toLowerCase() === "female"
                    ? patientF
                    : patientM
                }
                alt={selectedPatient.name}
              />
            </div>
            <div className="details-grid">
              <div>
                <strong>Name:</strong> {selectedPatient.name}
              </div>
              <div>
                <strong>Mobile:</strong> {selectedPatient.mobile}
              </div>
              <div>
                <strong>Sex:</strong> {selectedPatient.sex}
              </div>
              <div>
                <strong>Age:</strong> {selectedPatient.age}
              </div>
              <div>
                <strong>Email:</strong> {selectedPatient.email}
              </div>
              <div>
                <strong>Area:</strong> {selectedPatient.area}
              </div>
              <div>
                <strong>Referral Lab:</strong> {selectedPatient.referrallab}
              </div>
              <div>
                <strong>Height:</strong> {selectedPatient.height} cm
              </div>
              <div>
                <strong>Weight:</strong> {selectedPatient.weight} kg
              </div>
              <div>
                <strong>Blood Group:</strong> {selectedPatient.bloodgroup}
              </div>
              <div>
                <strong>Marital Status:</strong>{" "}
                {selectedPatient.materialstatus}
              </div>
              <div>
                <strong>Occupation:</strong> {selectedPatient.occupation}
              </div>
              <div>
                <strong>Pincode:</strong> {selectedPatient.pincode}
              </div>
              <div>
                <strong>Date of Birth:</strong>{" "}
                {selectedPatient.dateofbirth
                  ? selectedPatient.dateofbirth.split("T")[0]
                  : ""}
              </div>
              <div>
                <strong>Address:</strong> {selectedPatient.address}
              </div>
            </div>

            <h4>Referral Doctor</h4>
            <div className="details-grid">
              <div>
                <strong>Name:</strong> {selectedPatient.referraldoctor?.name}
              </div>
              <div>
                <strong>Mobile:</strong>{" "}
                {selectedPatient.referraldoctor?.mobile}
              </div>
              <div>
                <strong>Area:</strong> {selectedPatient.referraldoctor?.area}
              </div>
            </div>

            <div className="modal-actions">
              <button
                type="button"
                onClick={() => {
                  setViewModalOpen(false);
                  setSelectedPatient(null);
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
