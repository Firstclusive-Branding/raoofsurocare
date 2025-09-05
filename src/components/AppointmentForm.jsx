import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import { FaCalendarAlt } from "react-icons/fa";
import "../styles/AppointmentForm.css";

const base_url = import.meta.env.VITE_PUBLIC_API_URL;
const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;

async function loadRazorpay() {
  if (window.Razorpay) return true;
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function AppointmentForm() {
  const [doctors, setDoctors] = useState([]);
  const [intervals, setIntervals] = useState([]);
  const [bookedTimes, setBookedTimes] = useState([]);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const today = useMemo(() => new Date().toISOString().split("T")[0], []);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    doctorid: "",
    date: today,
    slotid: "",
    starttime: "",
    endtime: "",
    slottype: "offline",
  });

  // Helpers
  const parseTime = (timeStr) => {
    const [time, modifier] = timeStr.split(" ");
    let [hours, minutes] = time.split(":").map(Number);
    if (modifier === "PM" && hours !== 12) hours += 12;
    if (modifier === "AM" && hours === 12) hours = 0;

    const d = new Date();
    d.setHours(hours, minutes, 0, 0);
    return d;
  };

  const formatTime = (dateObj) =>
    dateObj
      .toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
      .replace("am", "AM")
      .replace("pm", "PM");

  const generateIntervals = (start, end, date) => {
    const out = [];
    const s = parseTime(start);
    const e = parseTime(end);

    const now = new Date();

    const isToday = date === today;

    while (s < e) {
      if (!isToday || s > now) {
        out.push(formatTime(s));
      }
      s.setMinutes(s.getMinutes() + 7);
    }
    setIntervals(out);
  };

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${base_url}/api/user/doctor/getall`);
        const data = await res.json();
        if (!data.error && data.data?.length) {
          setDoctors(data.data);
          setForm((prev) => ({ ...prev, doctorid: data.data[0]._id }));
        } else {
          setMessage("No doctors available right now.");
        }
      } catch (err) {
        console.error(err);
        setMessage("Unable to load doctors. Please try again later.");
      }
    })();
  }, [base_url]);

  const fetchBookedAppointments = async (doctorid, date) => {
    try {
      const res = await fetch(
        `${base_url}/api/user/appointment?doctorid=${doctorid}&date=${date}`
      );
      const data = await res.json();
      if (!data.error && data.data?.appointments) {
        const times = data.data.appointments.map((appt) =>
          formatTime(parseTime(appt.starttime))
        );
        setBookedTimes(times);
      } else {
        setBookedTimes([]);
      }
    } catch (err) {
      console.error(err);
      setBookedTimes([]);
    }
  };

  // Fetch slots for selected doctor/date
  useEffect(() => {
    (async () => {
      if (!form.doctorid || !form.date) {
        setMessage("Please select a date to see available slots.");
        return;
      }
      try {
        const res = await fetch(
          `${base_url}/api/user/slotbooking/${form.doctorid}?date=${form.date}`
        );
        const data = await res.json();
        if (!data.error && data.data?.length) {
          const slot = data.data[0];
          setForm((prev) => ({
            ...prev,
            slotid: slot._id,
            slottype: slot.slottype,
          }));
          generateIntervals(slot.starttime, slot.endtime, form.date);

          setMessage("");
          await fetchBookedAppointments(form.doctorid, form.date);
        } else {
          setIntervals([]);
          setBookedTimes([]);
          setMessage(
            "No slots available on this date. Please select another date."
          );
        }
      } catch (err) {
        console.error(err);
        setMessage("Unable to fetch slots. Please try again later.");
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.doctorid, form.date]);

  // Handlers
  const onChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSelectInterval = (time) => {
    const start = parseTime(time);
    const end = new Date(start.getTime() + 7 * 60000);
    setForm((prev) => ({
      ...prev,
      starttime: formatTime(start),
      endtime: formatTime(end),
    }));
  };

  const validate = () => {
    if (!form.name.trim()) return "Please enter your full name.";
    if (!/^\S+@\S+\.\S+$/.test(form.email))
      return "Please enter a valid email.";
    if (!/^\+?(\d{1,4})?[-.\s]?\d{10}$/.test(form.phone))
      return "Please enter a valid phone (10 digits).";
    if (!form.doctorid) return "Please choose a doctor.";
    if (!form.date) return "Please select a date.";
    if (!form.starttime) return "Please select a preferred time slot.";
    return "";
  };

  const openRazorpay = async (orderData, appointmentId) => {
    const ok = await loadRazorpay();
    if (!ok) {
      Swal.fire({
        title: "Error",
        text: "Failed to load payment gateway.",
        icon: "error",
      });
      return;
    }

    const options = {
      key: razorpayKey,
      amount: orderData.amount, // in paise from backend order
      currency: "INR",
      name: "Doctor Appointment",
      description: "Booking Fee",
      order_id: orderData.orderId, // backend-created Razorpay order id
      handler: async function (response) {
        try {
          const verifyRes = await fetch(`${base_url}/api/user/payment/verify`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              appointmentid: appointmentId,
              orderid: response.razorpay_order_id,
              paymentid: response.razorpay_payment_id,
              signature: response.razorpay_signature,
            }),
          });
          const verifyData = await verifyRes.json();
          if (!verifyData.error) {
            Swal.fire({
              title: "Payment Successful 🎉",
              text: "Your appointment has been confirmed and paid.",
              icon: "success",
              confirmButtonText: "OK",
            });
            // Reset form
            setForm((f) => ({
              ...f,
              name: "",
              email: "",
              phone: "",
              date: today,
              slotid: "",
              starttime: "",
              endtime: "",
              // keep doctor & slottype as-is
            }));
          } else {
            Swal.fire({
              title: "Payment Verification Failed",
              text: verifyData.message || "Please contact support.",
              icon: "error",
            });
          }
        } catch (err) {
          console.error("Verification error:", err);
          Swal.fire({
            title: "Error",
            text: "Unable to verify payment. Please contact support.",
            icon: "error",
          });
        }
      },
      prefill: {
        name: form.name,
        email: form.email,
        contact: form.phone,
      },
      theme: { color: "#13a4dd" }, // your primary
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) {
      Swal.fire({ title: "Missing Info", text: err, icon: "warning" });
      return;
    }

    setSubmitting(true);
    try {
      // 1) Create appointment
      const res = await fetch(`${base_url}/api/user/appointment/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientname: form.name,
          patientemail: form.email,
          patientmobile: form.phone,
          doctorid: form.doctorid,
          date: form.date,
          slotid: form.slotid,
          starttime: form.starttime,
          endtime: form.endtime,
          slottype: form.slottype,
        }),
      });
      const data = await res.json();

      if (data.error) {
        Swal.fire({
          title: "Failed",
          text: data.message || "Something went wrong. Please try again.",
          icon: "error",
        });
        setSubmitting(false);
        return;
      }

      const appointmentId = data.data._id;

      // 2) Create Razorpay order
      const orderRes = await fetch(`${base_url}/api/user/payment/order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appointmentid: appointmentId,
          amount: 700, // in INR; backend should convert to paise
        }),
      });
      const orderData = await orderRes.json();

      if (orderData.error) {
        Swal.fire({
          title: "Payment Failed",
          text: orderData.message,
          icon: "error",
        });
        setSubmitting(false);
        return;
      }

      await openRazorpay(orderData.data, appointmentId);
    } catch (error) {
      console.error("Create appointment error:", error);
      Swal.fire({
        title: "Error",
        text: "Unable to create appointment. Please try again later.",
        icon: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Animations
  const fade = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { duration: 0.45 } },
  };

  return (
    <section
      id="appointment"
      className="af-root"
      role="region"
      aria-labelledby="book-title"
    >
      <div className="af-container">
        {/* LEFT: Content */}
        <motion.div
          className="af-left"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <span className="af-badge">Dr. Raoof’s Urocare</span>

          <h2 id="book-title" className="af-heading">
            Book Your Visit Online
          </h2>

          <p className="af-desc">
            Consult <strong>Dr. Khizar Raoof</strong> for kidney stones,
            prostate issues, and urinary concerns. Pick a date &amp; time that
            works for you and confirm instantly with secure payment.
          </p>

          <div className="af-tags">
            <span className="af-tag af-tag--primary">
              Laser &amp; Laparoscopy
            </span>
            <span className="af-tag af-tag--secondary">Patient-First Care</span>
          </div>

          <img
            className="af-side-illustration"
            src="/assets/appointment form/appointment-form.png"
            alt="Urology care illustration"
            loading="eager"
            decoding="async"
          />
        </motion.div>

        {/* RIGHT: Form */}
        <motion.form
          className="af-form"
          onSubmit={onSubmit}
          noValidate
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.06 } } }}
        >
          <motion.div className="af-form-control" variants={fade}>
            <label htmlFor="name">Full Name</label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Enter your full name"
              value={form.name}
              onChange={onChange}
              required
            />
          </motion.div>

          <motion.div className="af-form-control" variants={fade}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={onChange}
              required
            />
          </motion.div>

          <motion.div className="af-form-control" variants={fade}>
            <label htmlFor="phone">Phone</label>
            <input
              id="phone"
              name="phone"
              type="tel"
              placeholder="Enter your phone number"
              value={form.phone}
              onChange={onChange}
              required
            />
          </motion.div>

          <motion.div className="af-form-control" variants={fade}>
            <label htmlFor="doctorid">Select Doctor</label>
            <select
              id="doctorid"
              name="doctorid"
              value={form.doctorid}
              onChange={onChange}
              required
            >
              {doctors.map((doc) => (
                <option key={doc._id} value={doc._id}>
                  {doc.name}
                </option>
              ))}
            </select>
          </motion.div>

          <motion.div className="af-form-control" variants={fade}>
            <label htmlFor="date">Preferred Date</label>
            <input
              id="date"
              name="date"
              type="date"
              min={today}
              value={form.date}
              onChange={onChange}
              required
            />
          </motion.div>

          <motion.div className="af-form-control" variants={fade}>
            <label>Preferred Time</label>
            <div className="af-slots-container">
              {intervals.length === 0 ? (
                <span className="af-text-muted">No intervals available.</span>
              ) : (
                intervals.map((time) => {
                  const selected = form.starttime === time;
                  const booked = bookedTimes.includes(time);
                  return (
                    <button
                      key={time}
                      type="button"
                      onClick={() => !booked && onSelectInterval(time)}
                      className={`af-slot-btn ${selected ? "selected" : ""} ${
                        booked ? "disabled" : ""
                      }`}
                      disabled={booked}
                      aria-pressed={selected}
                      aria-label={`Time ${time}${booked ? " (booked)" : ""}`}
                    >
                      <FaCalendarAlt style={{ marginRight: 6 }} /> {time}
                    </button>
                  );
                })
              )}
            </div>
          </motion.div>

          {message && (
            <motion.p className="af-status err" role="alert" variants={fade}>
              {message}
            </motion.p>
          )}

          <motion.button
            className="af-submit"
            type="submit"
            disabled={submitting || !form.starttime}
            aria-busy={submitting}
            variants={fade}
          >
            {submitting ? "Processing…" : "Pay & Book"}
          </motion.button>

          <p className="af-fineprint">
            By submitting, you agree to our{" "}
            <a href="/privacy" className="af-link-secondary">
              Privacy Policy
            </a>
            .
          </p>
        </motion.form>
      </div>
    </section>
  );
}
