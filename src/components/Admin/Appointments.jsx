"use client";
import React, { useState, useEffect } from "react";
import "../styles/Appointments.css";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { MdDelete } from "react-icons/md";

const base_url = import.meta.env.VITE_PUBLIC_API_URL;

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const fetchAppointments = async (search = "", page = currentPage) => {
    try {
      setLoading(true);
      const res = await fetch(`${base_url}/api/admin/appointment/getall`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pageno: page,
          sortby: { createdAt: "desc" },
          search: search,
        }),
      });

      const data = await res.json();

      if (!data.error && data.data && data.data.appointment) {
        setAppointments(data.data.appointment);
        setTotalPages(data.data.totalPages || 1);
      } else {
        setAppointments([]);
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
      toast.error("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setCurrentPage(0);
    fetchAppointments(searchTerm, 0);
  }, [searchTerm]);

  useEffect(() => {
    fetchAppointments(searchTerm, currentPage);
  }, [currentPage]);

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This appointment will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await fetch(`${base_url}/api/admin/appointment/delete`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ appointmentid: id }),
          });
          const data = await res.json();

          if (!data.error) {
            toast.success("Appointment deleted successfully");
            fetchAppointments(searchTerm, currentPage);
          } else {
            toast.error(data.message || "Failed to delete appointment");
          }
        } catch (error) {
          console.error("Error deleting appointment:", error);
          toast.error("Server error. Please try again later.");
        }
      }
    });
  };

  return (
    <div className="appointments-container">
      <div className="appointments-header">
        <h2 className="appointments-heading">Appointments</h2>

        <div className="appointments-search">
          <input
            type="text"
            placeholder="Search by name, mobile, email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="appointments-loading">Loading appointments...</div>
      ) : appointments.length === 0 ? (
        <p className="appointments-empty">No appointments found.</p>
      ) : (
        <>
          <table className="appointments-table">
            <thead>
              <tr>
                <th>Patient Name</th>
                <th>Mobile</th>
                <th>Email</th>
                <th>Doctor</th>
                <th>Specialization</th>
                <th>Date</th>
                <th>Time</th>
                <th>Type</th>
                <th>Status</th>
                <th>Payment</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appt) => (
                <tr key={appt._id}>
                  <td>{appt.patientid?.name || appt.patientname}</td>
                  <td>{appt.patientid?.mobile || appt.patientmobile}</td>
                  <td>{appt.patientid?.email || appt.patientemail}</td>

                  <td>{appt.doctorid?.name}</td>
                  <td>{appt.doctorid?.specialization}</td>
                  <td>{new Date(appt.date).toLocaleDateString()}</td>
                  <td>
                    {appt.starttime} - {appt.endtime}
                  </td>
                  <td>{appt.slottype}</td>
                  <td>
                    <span className={`status-badge ${appt.status}`}>
                      {appt.status}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`appointment-payment-badge ${appt.paymentstatus}`}
                    >
                      {appt.paymentstatus}
                    </span>
                  </td>
                  <td>{new Date(appt.createdAt).toLocaleString()}</td>
                  <td>
                    <button
                      className="appointment-delete-btn"
                      onClick={() => handleDelete(appt._id)}
                    >
                      <MdDelete />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="appointments-pagination">
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
    </div>
  );
};

export default Appointments;
