"use client";
import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import "../styles/Doctors.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";

const base_url = import.meta.env.VITE_PUBLIC_API_URL;

export default function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    _id: "",
    name: "",
    specialization: "",
    email: "",
    mobile: "",
  });
  const [isEditing, setIsEditing] = useState(false);

  // 🔹 New states for search + pagination
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchDoctors = async (search = "", page = currentPage) => {
    try {
      setLoading(true);
      const res = await fetch(`${base_url}/api/admin/doctor`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pageno: page,
          sortby: { createdAt: "desc" },
          search: search,
        }),
      });
      const data = await res.json();
      if (!data.error) {
        setDoctors(data.data.doctor || []);
        setTotalPages(data.data.totalPages || 1);
      }
    } catch (err) {
      toast.error("Failed to fetch doctors");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors(searchTerm, currentPage);
  }, [searchTerm, currentPage]);

  const openModal = (doctor = null) => {
    if (doctor) {
      setIsEditing(true);
      setFormData(doctor);
    } else {
      setIsEditing(false);
      setFormData({
        _id: "",
        name: "",
        specialization: "",
        email: "",
        mobile: "",
      });
    }
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = isEditing
        ? `${base_url}/api/admin/doctor/update`
        : `${base_url}/api/admin/doctor/create`;

      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (!result.error) {
        toast.success(
          isEditing
            ? "Doctor updated successfully!"
            : "Doctor added successfully!"
        );
        setModalOpen(false);
        fetchDoctors(searchTerm, currentPage);
      } else {
        toast.error(result.message || "Something went wrong");
      }
    } catch (err) {
      toast.error("Failed to save doctor");
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the doctor record!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await fetch(`${base_url}/api/admin/doctor/delete`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ _id: id }),
          });
          const data = await res.json();

          if (!data.error) {
            toast.success("Doctor deleted successfully!");
            fetchDoctors(searchTerm, currentPage);
          } else {
            toast.error(data.message || "Failed to delete doctor");
          }
        } catch (err) {
          toast.error("Failed to delete doctor");
          console.error(err);
        }
      }
    });
  };

  return (
    <div className="doctors-container">
      <div className="doctors-header">
        <h2>Manage Doctors</h2>
        <div className="doctors-search-wrapper">
          <input
            type="text"
            placeholder="Search doctors..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(0);
            }}
          />

          <button onClick={() => openModal()}>Add Doctor +</button>
        </div>
      </div>

      {loading ? (
        <div className="doctors-loading">Loading doctors...</div>
      ) : (
        <>
          <table className="doctors-table">
            <thead>
              <tr>
                <th>Full Name</th>
                <th>Specialization</th>
                <th>Email</th>
                <th>Mobile</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {doctors.length > 0 ? (
                doctors.map((doctor) => (
                  <tr key={doctor._id}>
                    <td>{doctor.name}</td>
                    <td>{doctor.specialization}</td>
                    <td>{doctor.email}</td>
                    <td>{doctor.mobile}</td>
                    <td>
                      <FaEdit
                        className="doctors-icon edit"
                        onClick={() => openModal(doctor)}
                      />
                      <FaTrash
                        className="doctors-icon delete"
                        onClick={() => handleDelete(doctor._id)}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="doctors-empty">
                    No doctors found
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* 🔹 Pagination */}
          <div className="doctors-pagination">
            <button
              disabled={currentPage === 0}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
            >
              Previous
            </button>
            <span>
              Page {currentPage + 1} of {totalPages}
            </span>
            <button
              disabled={currentPage + 1 >= totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
            >
              Next
            </button>
          </div>
        </>
      )}

      {modalOpen && (
        <div className="doctors-modal">
          <div className="doctors-modal-content">
            <h3>{isEditing ? "Edit Doctor" : "Add Doctor"}</h3>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Full Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
              <input
                type="text"
                placeholder="Specialization"
                value={formData.specialization}
                onChange={(e) =>
                  setFormData({ ...formData, specialization: e.target.value })
                }
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
              <input
                type="text"
                placeholder="Mobile"
                value={formData.mobile}
                onChange={(e) =>
                  setFormData({ ...formData, mobile: e.target.value })
                }
                required
              />
              <div className="doctors-modal-actions">
                <button type="submit">{isEditing ? "Update" : "Create"}</button>
                <button type="button" onClick={() => setModalOpen(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
