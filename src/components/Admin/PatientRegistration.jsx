"use client";
import React, { useState } from "react";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/PatientRegistration.css";

const base_url = import.meta.env.VITE_PUBLIC_API_URL;

export default function PatientRegistration() {
  const [formData, setFormData] = useState({
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
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    name.includes("referraldoctor")
      ? setFormData((p) => ({
          ...p,
          referraldoctor: { ...p.referraldoctor, [name.split(".")[1]]: value },
        }))
      : setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.mobile) {
      toast.error("Name & Mobile are required!");
      return;
    }

    try {
      const res = await fetch(`${base_url}/api/admin/patient/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok && !data.error) {
        Swal.fire({
          title: "Success!",
          text: "Patient registered successfully.",
          icon: "success",
          confirmButtonColor: "#13a4dd",
        });
        setFormData({
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
        });
      } else {
        toast.error(data.message || "Failed to register patient");
      }
    } catch {
      toast.error("Something went wrong!");
    }
  };

  const fields = [
    ["name", "Patient Name", "Enter Patient Name *"],
    ["mobile", "Mobile", "Enter Mobile Number *"],
    ["sex", "Sex", "Select Sex"],
    ["age", "Age", "Enter Age"],
    ["email", "Email", "Enter Email Address"],
    ["area", "Area", "Enter Area"],
    ["referrallab", "Referral Lab", "Enter Referral Lab"],
    ["height", "Height (cm)", "Enter Height in cm"],
    ["materialstatus", "Marital Status", "Select Marital Status"],
    ["occupation", "Occupation", "Enter Occupation"],
    ["pincode", "Pincode", "Enter Pincode"],
    ["weight", "Weight (kg)", "Enter Weight in kg"],
    ["image", "Profile Image", "Upload Profile Image"],
    ["bloodgroup", "Blood Group", "Select Blood Group"],
    ["dateofbirth", "Date of Birth", "Select Date of Birth"],
  ];

  return (
    <div className="patient-form">
      <h2>Patient Registration</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          {fields.map(([n, t, ph]) => (
            <div key={n} className="form-field">
              <label htmlFor={n}>{t}</label>

              {n === "sex" ? (
                <div className="patient-radio-group">
                  <label>
                    <input
                      type="radio"
                      name={n}
                      value="male"
                      checked={formData[n] === "male"}
                      onChange={handleChange}
                    />
                    Male
                  </label>
                  <label>
                    <input
                      type="radio"
                      name={n}
                      value="female"
                      checked={formData[n] === "female"}
                      onChange={handleChange}
                    />
                    Female
                  </label>
                  <label>
                    <input
                      type="radio"
                      name={n}
                      value="other"
                      checked={formData[n] === "other"}
                      onChange={handleChange}
                    />
                    Other
                  </label>
                </div>
              ) : (
                <input
                  id={n}
                  type={
                    ["age", "height", "weight"].includes(n)
                      ? "number"
                      : n === "dateofbirth"
                      ? "date"
                      : "text"
                  }
                  name={n}
                  placeholder={ph}
                  value={formData[n]}
                  onChange={handleChange}
                />
              )}
            </div>
          ))}
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

        <textarea
          name="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleChange}
        />

        <button type="submit">Register</button>
      </form>
    </div>
  );
}
