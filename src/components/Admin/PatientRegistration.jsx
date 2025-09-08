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
    ["name", "Patient Name *"],
    ["mobile", "Mobile *"],
    ["sex", "Sex"],
    ["age", "Age"],
    ["email", "Email"],
    ["area", "Area"],
    ["referrallab", "Referral Lab"],
    ["height", "Height (cm)"],
    ["materialstatus", "Marital Status"],
    ["occupation", "Occupation"],
    ["pincode", "Pincode"],
    ["weight", "Weight (kg)"],
    ["image", "Profile Image"],
    ["bloodgroup", "Blood Group"],
    ["dateofbirth", "Date of Birth"],
  ];

  return (
    <div className="patient-form">
      <h2>Patient Registration</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          {fields.map(([n, ph]) => (
            <input
              key={n}
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
