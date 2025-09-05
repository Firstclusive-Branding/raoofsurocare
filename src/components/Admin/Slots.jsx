"use client";
import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import "react-toastify/dist/ReactToastify.css";
import "../styles/Slots.css";

const base_url = import.meta.env.VITE_PUBLIC_API_URL;

export default function Slots() {
  const [slots, setSlots] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    _id: "",
    doctorid: "",
    date: "",
    startHour: "10",
    startMinute: "00",
    startPeriod: "AM",
    endHour: "11",
    endMinute: "00",
    endPeriod: "AM",
    slottype: "offline",
  });

  // Fetch Slots
  const fetchSlots = async () => {
    try {
      const res = await fetch(`${base_url}/api/admin/slotbooking`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pageno: 0,
          sortby: { createdAt: "desc" },
          search: "",
        }),
      });
      const data = await res.json();
      if (!data.error) setSlots(data.data.slotbooking);
    } catch (err) {
      toast.error("Failed to fetch slots");
    }
  };

  // Fetch Doctors
  const fetchDoctors = async () => {
    try {
      const res = await fetch(`${base_url}/api/admin/doctor`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pageno: 0,
          sortby: { createdAt: "desc" },
          search: "",
        }),
      });
      const data = await res.json();
      if (!data.error) setDoctors(data.data.doctor);
    } catch (err) {
      toast.error("Failed to fetch doctors");
    }
  };

  useEffect(() => {
    fetchSlots();
    fetchDoctors();
  }, []);

  // Helpers
  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toISOString().split("T")[0];
  };

  const parseTime = (timeStr) => {
    if (!timeStr) return { hour: "10", minute: "00", period: "AM" };
    const [time, period] = timeStr.split(" ");
    const [hour, minute] = time.split(":");
    return { hour, minute, period };
  };

  const openModal = (slot = null) => {
    if (slot) {
      setIsEditing(true);
      const start = parseTime(slot.starttime);
      const end = parseTime(slot.endtime);
      setFormData({
        _id: slot._id,
        doctorid: slot.doctorid,
        date: formatDate(slot.date),
        startHour: start.hour,
        startMinute: start.minute,
        startPeriod: start.period,
        endHour: end.hour,
        endMinute: end.minute,
        endPeriod: end.period,
        slottype: slot.slottype,
      });
    } else {
      setIsEditing(false);
      setFormData({
        _id: "",
        doctorid: doctors[0]?._id || "",
        date: "",
        startHour: "10",
        startMinute: "00",
        startPeriod: "AM",
        endHour: "11",
        endMinute: "00",
        endPeriod: "AM",
        slottype: "offline",
      });
    }
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const starttime = `${formData.startHour}:${formData.startMinute} ${formData.startPeriod}`;
    const endtime = `${formData.endHour}:${formData.endMinute} ${formData.endPeriod}`;

    const payload = {
      _id: formData._id,
      doctorid: formData.doctorid,
      date: formData.date,
      starttime,
      endtime,
      slottype: formData.slottype,
    };

    try {
      const url = isEditing
        ? `${base_url}/api/admin/slotbooking/update`
        : `${base_url}/api/admin/slotbooking/create`;
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (!result.error) {
        toast.success(isEditing ? "Slot updated!" : "Slot created!");
        setModalOpen(false);
        fetchSlots();
      } else {
        toast.error(result.message || "Failed to save slot");
      }
    } catch {
      toast.error("Error saving slot");
    }
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Delete slot?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (res) => {
      if (res.isConfirmed) {
        try {
          const response = await fetch(
            `${base_url}/api/admin/slotbooking/delete`,
            {
              method: "DELETE",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ _id: id }),
            }
          );
          const data = await response.json();
          if (!data.error) {
            toast.success("Slot deleted");
            fetchSlots();
          } else {
            toast.error("Failed to delete");
          }
        } catch {
          toast.error("Error deleting slot");
        }
      }
    });
  };

  const getDoctorName = (id) => {
    const doc = doctors.find((d) => d._id === id);
    return doc ? doc.name : "Unknown";
  };

  // Time dropdowns
  const hours = Array.from({ length: 12 }, (_, i) =>
    String(i + 1).padStart(2, "0")
  );
  const minutes = Array.from({ length: 60 }, (_, i) =>
    String(i).padStart(2, "0")
  );
  const periods = ["AM", "PM"];

  return (
    <div className="slots-container">
      <div className="slots-header">
        <h2>Appointment Slots</h2>
        <button onClick={() => openModal()}>+ Add Slot</button>
      </div>

      <table className="slots-table">
        <thead>
          <tr>
            <th>Doctor</th>
            <th>Date</th>
            <th>Start</th>
            <th>End</th>
            <th>Type</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {slots.map((slot) => (
            <tr key={slot._id}>
              <td>{getDoctorName(slot.doctorid)}</td>
              <td>{new Date(slot.date).toLocaleDateString()}</td>
              <td>{slot.starttime}</td>
              <td>{slot.endtime}</td>
              <td>{slot.slottype}</td>
              <td>
                <FaEdit className="icon edit" onClick={() => openModal(slot)} />
                <FaTrash
                  className="icon delete"
                  onClick={() => handleDelete(slot._id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {modalOpen && (
        <div className="slots-modal">
          <div className="slots-modal-content">
            <h3>{isEditing ? "Edit Slot" : "Add Slot"}</h3>
            <form onSubmit={handleSubmit}>
              <select
                value={formData.doctorid}
                onChange={(e) =>
                  setFormData({ ...formData, doctorid: e.target.value })
                }
                required
              >
                <option value="">Select Doctor</option>
                {doctors.map((d) => (
                  <option key={d._id} value={d._id}>
                    {d.name}
                  </option>
                ))}
              </select>

              <input
                type="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                required
              />

              <label>Start Time</label>
              <div className="time-group">
                <select
                  value={formData.startHour}
                  onChange={(e) =>
                    setFormData({ ...formData, startHour: e.target.value })
                  }
                >
                  {hours.map((h) => (
                    <option key={h}>{h}</option>
                  ))}
                </select>
                <select
                  value={formData.startMinute}
                  onChange={(e) =>
                    setFormData({ ...formData, startMinute: e.target.value })
                  }
                >
                  {minutes.map((m) => (
                    <option key={m}>{m}</option>
                  ))}
                </select>
                <select
                  value={formData.startPeriod}
                  onChange={(e) =>
                    setFormData({ ...formData, startPeriod: e.target.value })
                  }
                >
                  {periods.map((p) => (
                    <option key={p}>{p}</option>
                  ))}
                </select>
              </div>

              <label>End Time</label>
              <div className="time-group">
                <select
                  value={formData.endHour}
                  onChange={(e) =>
                    setFormData({ ...formData, endHour: e.target.value })
                  }
                >
                  {hours.map((h) => (
                    <option key={h}>{h}</option>
                  ))}
                </select>
                <select
                  value={formData.endMinute}
                  onChange={(e) =>
                    setFormData({ ...formData, endMinute: e.target.value })
                  }
                >
                  {minutes.map((m) => (
                    <option key={m}>{m}</option>
                  ))}
                </select>
                <select
                  value={formData.endPeriod}
                  onChange={(e) =>
                    setFormData({ ...formData, endPeriod: e.target.value })
                  }
                >
                  {periods.map((p) => (
                    <option key={p}>{p}</option>
                  ))}
                </select>
              </div>

              <select
                value={formData.slottype}
                onChange={(e) =>
                  setFormData({ ...formData, slottype: e.target.value })
                }
              >
                <option value="online">Online</option>
                <option value="offline">Offline</option>
              </select>

              <div className="slots-actions">
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
