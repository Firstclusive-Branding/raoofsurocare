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
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

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
    slottimerange: "7",
    slottype: "offline",

    breaks: [],
  });

  // helpers
  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toISOString().split("T")[0];
  };

  const parse24to12 = (timeStr) => {
    if (!timeStr) return { hour: "10", minute: "00", period: "AM" };
    const [h, m] = timeStr.split(":").map((v) => parseInt(v, 10));
    let period = h >= 12 ? "PM" : "AM";
    let hour = h % 12 === 0 ? 12 : h % 12;
    return {
      hour: String(hour).padStart(2, "0"),
      minute: String(m).padStart(2, "0"),
      period,
    };
  };

  const convertTo24Hour = (hour, minute, period) => {
    let h = parseInt(hour, 10);
    if (period === "PM" && h !== 12) h += 12;
    if (period === "AM" && h === 12) h = 0;
    return `${String(h).padStart(2, "0")}:${minute}`;
  };

  // Fetch Slots
  const fetchSlots = async (search = "", page = currentPage) => {
    try {
      setLoading(true);
      const res = await fetch(`${base_url}/api/admin/slotbooking`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pageno: page,
          sortby: { createdAt: "desc" },
          search,
        }),
      });
      const data = await res.json();
      if (!data.error) {
        setSlots(data.data.slotbooking || []);
        setTotalPages(data.data.totalPages || 1);
      } else {
        setSlots([]);
      }
    } catch (err) {
      toast.error("Failed to fetch slots");
    } finally {
      setLoading(false);
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
      if (!data.error) setDoctors(data.data.doctor || []);
    } catch (err) {
      toast.error("Failed to fetch doctors");
    }
  };

  useEffect(() => {
    setCurrentPage(0);
    fetchSlots(searchTerm, 0);
    fetchDoctors();
  }, [searchTerm]);

  useEffect(() => {
    fetchSlots(searchTerm, currentPage);
  }, [currentPage]);

  const openModal = (slot = null) => {
    if (slot) {
      setIsEditing(true);
      const start = parse24to12(slot.starttime);
      const end = parse24to12(slot.endtime);
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
        slottimerange: slot.slottimerange,
        slottype: slot.slottype,
        breaks: slot.breaks.map((b) => {
          const bs = parse24to12(b.breakstart);
          const be = parse24to12(b.breakend);
          return {
            breakStartHour: bs.hour,
            breakStartMinute: bs.minute,
            breakStartPeriod: bs.period,
            breakEndHour: be.hour,
            breakEndMinute: be.minute,
            breakEndPeriod: be.period,
          };
        }),
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
        slottimerange: "",
        slottype: "offline",
        breaks: [],
      });
    }
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const starttime = convertTo24Hour(
      formData.startHour,
      formData.startMinute,
      formData.startPeriod
    );
    const endtime = convertTo24Hour(
      formData.endHour,
      formData.endMinute,
      formData.endPeriod
    );

    const breaks = formData.breaks.map((b) => ({
      breakstart: convertTo24Hour(
        b.breakStartHour,
        b.breakStartMinute,
        b.breakStartPeriod
      ),
      breakend: convertTo24Hour(
        b.breakEndHour,
        b.breakEndMinute,
        b.breakEndPeriod
      ),
    }));

    const payload = {
      _id: formData._id,
      doctorid: formData.doctorid,
      date: formData.date,
      starttime,
      endtime,
      slottype: formData.slottype,
      slottimerange: formData.slottimerange,
      breaks,
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
        fetchSlots(searchTerm, currentPage);
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
            fetchSlots(searchTerm, currentPage);
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

  // dropdown values
  const hours = Array.from({ length: 12 }, (_, i) =>
    String(i + 1).padStart(2, "0")
  );
  const minutes = Array.from({ length: 60 }, (_, i) =>
    String(i).padStart(2, "0")
  );
  const periods = ["AM", "PM"];

  const addBreak = () => {
    setFormData({
      ...formData,
      breaks: [
        ...formData.breaks,
        {
          breakStartHour: "12",
          breakStartMinute: "00",
          breakStartPeriod: "PM",
          breakEndHour: "12",
          breakEndMinute: "30",
          breakEndPeriod: "PM",
        },
      ],
    });
  };

  const updateBreak = (index, key, value) => {
    const updated = [...formData.breaks];
    updated[index][key] = value;
    setFormData({ ...formData, breaks: updated });
  };

  const removeBreak = (index) => {
    const updated = [...formData.breaks];
    updated.splice(index, 1);
    setFormData({ ...formData, breaks: updated });
  };

  const formatTo12Hour = (timeStr) => {
    if (!timeStr) return "";
    let [hour, minute] = timeStr.split(":").map(Number);
    const period = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12; // convert 0 -> 12, 13 -> 1, etc.
    return `${String(hour).padStart(2, "0")}:${String(minute).padStart(
      2,
      "0"
    )} ${period}`;
  };

  return (
    <div className="slots-container">
      <div className="slots-header">
        <h2>Appointment Slots</h2>
        <div className="slots-search">
          <input
            type="text"
            placeholder="Search by doctor or type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button onClick={() => openModal()}>+ Add Slot</button>
        </div>
      </div>

      {loading ? (
        <div className="slots-loading">Loading slots...</div>
      ) : slots.length === 0 ? (
        <p className="slots-empty">No slots found.</p>
      ) : (
        <>
          <table className="slots-table">
            <thead>
              <tr>
                <th>Doctor</th>
                <th>Date</th>
                <th>Start</th>
                <th>End</th>
                <th>Slots Range</th>
                <th>Type</th>
                <th>Breaks</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {slots.map((slot) => (
                <tr key={slot._id}>
                  <td>{getDoctorName(slot.doctorid)}</td>
                  <td>{new Date(slot.date).toLocaleDateString()}</td>
                  <td>{formatTo12Hour(slot.starttime)}</td>
                  <td>{formatTo12Hour(slot.endtime)}</td>
                  <td>{slot.slottimerange || 7} minutes</td>
                  <td>{slot.slottype}</td>
                  <td>
                    {slot.breaks && slot.breaks.length > 0
                      ? slot.breaks.map((b, i) => (
                          <div key={i}>
                            {formatTo12Hour(b.breakstart)} -{" "}
                            {formatTo12Hour(b.breakend)}
                          </div>
                        ))
                      : "No breaks"}
                  </td>

                  <td>
                    <FaEdit
                      className="slots-icon slots-edit"
                      onClick={() => openModal(slot)}
                    />
                    <FaTrash
                      className="slots-icon slots-delete"
                      onClick={() => handleDelete(slot._id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="slots-pagination">
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
              <div className="slots-time-group">
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
              <div className="slots-time-group">
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

              <input
                type="number"
                value={formData.slottimerange}
                onChange={(e) =>
                  setFormData({ ...formData, slottimerange: e.target.value })
                }
                placeholder="Slot Time Range (in minutes)"
              />

              <select
                value={formData.slottype}
                onChange={(e) =>
                  setFormData({ ...formData, slottype: e.target.value })
                }
              >
                <option value="online">Online</option>
                <option value="offline">Offline</option>
              </select>

              <div className="slots-breaks-container">
                <h4>Breaks</h4>
                {formData.breaks.map((b, i) => (
                  <div key={i} className="slots-break-row">
                    <div className="slots-time-group break">
                      <select
                        value={b.breakStartHour}
                        onChange={(e) =>
                          updateBreak(i, "breakStartHour", e.target.value)
                        }
                      >
                        {hours.map((h) => (
                          <option key={h}>{h}</option>
                        ))}
                      </select>
                      :
                      <select
                        value={b.breakStartMinute}
                        onChange={(e) =>
                          updateBreak(i, "breakStartMinute", e.target.value)
                        }
                      >
                        {minutes.map((m) => (
                          <option key={m}>{m}</option>
                        ))}
                      </select>
                      :
                      <select
                        value={b.breakStartPeriod}
                        onChange={(e) =>
                          updateBreak(i, "breakStartPeriod", e.target.value)
                        }
                      >
                        {periods.map((p) => (
                          <option key={p}>{p}</option>
                        ))}
                      </select>
                    </div>
                    -
                    <div className="slots-time-group break">
                      <select
                        value={b.breakEndHour}
                        onChange={(e) =>
                          updateBreak(i, "breakEndHour", e.target.value)
                        }
                      >
                        {hours.map((h) => (
                          <option key={h}>{h}</option>
                        ))}
                      </select>
                      :
                      <select
                        value={b.breakEndMinute}
                        onChange={(e) =>
                          updateBreak(i, "breakEndMinute", e.target.value)
                        }
                      >
                        {minutes.map((m) => (
                          <option key={m}>{m}</option>
                        ))}
                      </select>
                      :
                      <select
                        value={b.breakEndPeriod}
                        onChange={(e) =>
                          updateBreak(i, "breakEndPeriod", e.target.value)
                        }
                      >
                        {periods.map((p) => (
                          <option key={p}>{p}</option>
                        ))}
                      </select>
                    </div>
                    <button
                      type="button"
                      className="slots-break-remove"
                      onClick={() => removeBreak(i)}
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))}
                <button type="button" onClick={addBreak}>
                  + Add Break
                </button>
              </div>

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
