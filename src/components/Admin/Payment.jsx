import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import "../styles/Payment.css";
import { MdDelete } from "react-icons/md";

const base_url = import.meta.env.VITE_PUBLIC_API_URL;

export default function Payment() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const fetchPayments = async (search = "", page = currentPage) => {
    try {
      setLoading(true);
      const res = await fetch(`${base_url}/api/admin/payment/getall`, {
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
        setPayments(data.data.payments || []);
        setTotalPages(data.data.totalPages || 1);
      } else {
        toast.error(data.message || "Failed to fetch payments");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong while fetching payments");
    } finally {
      setLoading(false);
    }
  };

  // Delete payment
  const handleDelete = async (paymentid) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This payment record will be deleted permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await fetch(`${base_url}/api/admin/payment/delete`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ paymentid }),
          });

          const data = await res.json();
          if (!data.error) {
            toast.success("Payment deleted successfully");
            fetchPayments(searchTerm, currentPage);
          } else {
            toast.error(data.message || "Failed to delete payment");
          }
        } catch (err) {
          console.error(err);
          toast.error("Something went wrong while deleting");
        }
      }
    });
  };

  // Fetch on mount + whenever search changes
  useEffect(() => {
    setCurrentPage(0);
    fetchPayments(searchTerm, 0);
  }, [searchTerm]);

  // Fetch when page changes
  useEffect(() => {
    fetchPayments(searchTerm, currentPage);
  }, [currentPage]);

  return (
    <div className="payment-container">
      <div className="payment-header">
        <h2 className="payment-heading">Payments</h2>
        <div className="payment-search">
          <input
            type="text"
            placeholder="Search by patient, doctor, or status..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="payment-loading">Loading payments...</div>
      ) : payments.length === 0 ? (
        <p className="payment-empty">No payments found</p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="payment-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Patient</th>
                  <th>Doctor</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Payment Type</th>
                  <th>Paid At</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((pay, idx) => (
                  <tr key={pay._id}>
                    <td>{idx + 1 + currentPage * 10}</td>
                    <td>
                      <div>{pay.appointmentid?.patientname}</div>
                      <div className="text-xs text-gray-500">
                        Phone: {pay.appointmentid?.patientmobile}
                      </div>
                    </td>
                    <td>
                      {pay.doctorid?.name}
                      <br />
                      <span className="text-xs text-gray-500">
                        {pay.doctorid?.specialization}
                      </span>
                    </td>
                    <td>
                      {new Date(pay.appointmentid?.date).toLocaleDateString()}
                    </td>
                    <td>
                      {pay.appointmentid?.starttime} -{" "}
                      {pay.appointmentid?.endtime}
                    </td>
                    <td>₹{pay.amount}</td>
                    <td>
                      <span
                        className={`payment-status-badge ${pay.paymentstatus}`}
                      >
                        {pay.paymentstatus}
                      </span>
                    </td>
                    {/* <td>{pay?.method || "Cash"}</td> */}
                    <td>
                      {pay?.method
                        ? pay.method.charAt(0).toUpperCase() +
                          pay.method.slice(1)
                        : "Cash"}
                    </td>

                    <td>{new Date(pay.paidAt).toLocaleString()}</td>
                    <td>
                      <button
                        onClick={() => handleDelete(pay._id)}
                        className="payment-delete-btn"
                        title="Delete payment"
                      >
                        <MdDelete />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="payment-pagination">
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
}
