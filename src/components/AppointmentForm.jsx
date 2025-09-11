// import React, { useEffect, useMemo, useState } from "react";
// import { motion } from "framer-motion";
// import Swal from "sweetalert2";
// import { FaCalendarAlt } from "react-icons/fa";
// import "../styles/AppointmentForm.css";

// const base_url = import.meta.env.VITE_PUBLIC_API_URL;
// const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;

// async function loadRazorpay() {
//   if (window.Razorpay) return true;
//   return new Promise((resolve) => {
//     const script = document.createElement("script");
//     script.src = "https://checkout.razorpay.com/v1/checkout.js";
//     script.async = true;
//     script.onload = () => resolve(true);
//     script.onerror = () => resolve(false);
//     document.body.appendChild(script);
//   });
// }

// export default function AppointmentForm() {
//   const [doctors, setDoctors] = useState([]);
//   const [intervals, setIntervals] = useState([]);
//   const [bookedTimes, setBookedTimes] = useState([]);
//   const [message, setMessage] = useState("");
//   const [submitting, setSubmitting] = useState(false);
//   const [availableSlots, setAvailableSlots] = useState([]);

//   const today = useMemo(() => new Date().toISOString().split("T")[0], []);
//   const [form, setForm] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     doctorid: "",
//     date: today,
//     slotid: "",
//     starttime: "",
//     endtime: "",
//     slottype: "offline",
//   });

//   // const parseTime = (timeStr) => {
//   //   const [hours, minutes] = timeStr.split(":").map(Number);
//   //   const d = new Date();
//   //   d.setHours(hours, minutes, 0, 0);
//   //   return d;
//   // };

//   const parseTime = (timeStr) => {
//     if (!timeStr) return new Date();

//     if (timeStr.includes("AM") || timeStr.includes("PM")) {
//       const [time, modifier] = timeStr.split(" ");
//       let [hours, minutes] = time.split(":").map(Number);
//       if (modifier === "PM" && hours !== 12) hours += 12;
//       if (modifier === "AM" && hours === 12) hours = 0;
//       const d = new Date();
//       d.setHours(hours, minutes, 0, 0);
//       return d;
//     }

//     const [hours, minutes] = timeStr.split(":").map(Number);
//     const d = new Date();
//     d.setHours(hours, minutes, 0, 0);
//     return d;
//   };

//   const formatTime = (dateObj) =>
//     dateObj
//       .toLocaleTimeString([], {
//         hour: "2-digit",
//         minute: "2-digit",
//         hour12: true,
//       })
//       .replace("am", "AM")
//       .replace("pm", "PM");

//   // const generateIntervals = (start, end, date, slotRange = 7) => {
//   //   const out = [];
//   //   const s = parseTime(start);
//   //   const e = parseTime(end);

//   //   const now = new Date();
//   //   const isToday = date === today;

//   //   while (s < e) {
//   //     if (!isToday || s > now) {
//   //       out.push({
//   //         display: formatTime(new Date(s)),
//   //         value: s.toISOString().slice(11, 16),
//   //       });
//   //     }
//   //     s.setMinutes(s.getMinutes() + (slotRange || 7));
//   //   }

//   //   return out;
//   // };

//   const generateIntervals = (start, end, date, slotTimerange = 7) => {
//     const out = [];
//     const s = parseTime(start);
//     const e = parseTime(end);
//     const now = new Date();
//     const isToday = date === today;

//     while (s < e) {
//       if (!isToday || s > now) {
//         out.push(formatTime(new Date(s))); // ✅ AM/PM format
//       }
//       s.setMinutes(s.getMinutes() + slotTimerange);
//     }

//     return out;
//   };

//   useEffect(() => {
//     (async () => {
//       try {
//         const res = await fetch(`${base_url}/api/user/doctor/getall`);
//         const data = await res.json();
//         if (!data.error && data.data?.length) {
//           setDoctors(data.data);
//           setForm((prev) => ({
//             ...prev,
//             doctorid: data.data[0]._id,
//             slottype: form.slottype,
//           }));
//         } else {
//           setMessage("No doctors available right now.");
//         }
//       } catch (err) {
//         console.error(err);
//         setMessage("Unable to load doctors. Please try again later.");
//       }
//     })();
//   }, [base_url]);

//   // const fetchBookedAppointments = async (doctorid, date) => {
//   //   try {
//   //     const res = await fetch(
//   //       `${base_url}/api/user/appointment?doctorid=${doctorid}&date=${date}`
//   //     );
//   //     const data = await res.json();
//   //     if (!data.error && data.data?.appointments) {
//   //       return data.data.appointments.map((appt) => appt.starttime);
//   //     }
//   //     return [];
//   //   } catch {
//   //     return [];
//   //   }
//   // };

//   const fetchBookedAppointments = async (doctorid, date) => {
//     try {
//       const res = await fetch(
//         `${base_url}/api/user/appointment?doctorid=${doctorid}&date=${date}`
//       );
//       const data = await res.json();
//       if (!data.error && data.data?.appointments) {
//         return data.data.appointments.map((appt) =>
//           formatTime(parseTime(appt.starttime))
//         );
//       }
//       return [];
//     } catch {
//       return [];
//     }
//   };

//   // useEffect(() => {
//   //   (async () => {
//   //     if (!form.doctorid || !form.date) {
//   //       setMessage("Please select a date to see available slots.");
//   //       return;
//   //     }
//   //     try {
//   //       const res = await fetch(
//   //         `${base_url}/api/user/slotbooking/${form.doctorid}?date=${form.date}`
//   //       );
//   //       const data = await res.json();

//   //       if (!data.error && data.data?.length) {
//   //         const filteredSlots = data.data.filter(
//   //           (slot) => slot.slottype === form.slottype
//   //         );

//   //         if (!filteredSlots.length) {
//   //           setIntervals([]);
//   //           setBookedTimes([]);
//   //           setMessage("No slots available for this type on this date.");
//   //           return;
//   //         }

//   //         // ✅ generate all intervals
//   //         let allIntervals = [];
//   //         filteredSlots.forEach((slot) => {
//   //           allIntervals = [
//   //             ...allIntervals,
//   //             ...generateIntervals(
//   //               slot.starttime,
//   //               slot.endtime,
//   //               form.date,
//   //               slot.slottimerange ? parseInt(slot.slottimerange, 10) : 7
//   //             ),
//   //           ];
//   //         });

//   //         setIntervals(allIntervals);
//   //         setAvailableSlots(filteredSlots);
//   //         setMessage("");

//   //         // ✅ now mark break times
//   //         let breakTimes = [];
//   //         filteredSlots.forEach((slot) => {
//   //           slot.breaks?.forEach((b) => {
//   //             const bs = parseTime(b.breakstart);
//   //             const be = parseTime(b.breakend);
//   //             allIntervals.forEach(({ value }) => {
//   //               const t = parseTime(value);
//   //               if (t >= bs && t < be) {
//   //                 breakTimes.push(value);
//   //               }
//   //             });
//   //           });
//   //         });

//   //         setForm((prev) => ({
//   //           ...prev,
//   //           slotid: filteredSlots[0]._id,
//   //           slottype: filteredSlots[0].slottype,
//   //         }));

//   //         const apptTimes = await fetchBookedAppointments(
//   //           form.doctorid,
//   //           form.date
//   //         );
//   //         setBookedTimes([...new Set([...breakTimes, ...apptTimes])]);
//   //       } else {
//   //         setIntervals([]);
//   //         setBookedTimes([]);
//   //         setMessage(
//   //           "No slots available on this date. Please select another date."
//   //         );
//   //       }
//   //     } catch (err) {
//   //       console.error(err);
//   //       setMessage("Unable to fetch slots. Please try again later.");
//   //     }
//   //   })();
//   // }, [form.doctorid, form.date, form.slottype]);

//   useEffect(() => {
//     (async () => {
//       if (!form.doctorid || !form.date) {
//         setIntervals([]);
//         setBookedTimes([]);
//         setMessage("Please select a date to see available slots.");
//         return;
//       }

//       try {
//         const res = await fetch(
//           `${base_url}/api/user/slotbooking/${form.doctorid}?date=${form.date}`
//         );
//         const data = await res.json();

//         if (!data.error && data.data?.length) {
//           const filteredSlots = data.data.filter(
//             (slot) => slot.slottype === form.slottype
//           );

//           if (!filteredSlots.length) {
//             setIntervals([]);
//             setBookedTimes([]);
//             setMessage("No slots available for this type on this date.");
//             return;
//           }

//           // ✅ generate all intervals
//           let allIntervals = [];
//           filteredSlots.forEach((slot) => {
//             allIntervals = [
//               ...allIntervals,
//               ...generateIntervals(
//                 slot.starttime,
//                 slot.endtime,
//                 form.date,
//                 slot.slottimerange ? parseInt(slot.slottimerange, 10) : 7
//               ),
//             ];
//           });

//           setIntervals(allIntervals);
//           setAvailableSlots(filteredSlots);
//           setMessage("");

//           let breakTimes = [];
//           filteredSlots.forEach((slot) => {
//             slot.breaks?.forEach((b) => {
//               const bs = parseTime(b.breakstart);
//               const be = parseTime(b.breakend);

//               allIntervals.forEach(({ value }) => {
//                 const t = parseTime(value);
//                 if (t >= bs && t < be) {
//                   breakTimes.push(formatTime(t));
//                 }
//               });
//             });
//           });

//           setForm((prev) => ({
//             ...prev,
//             slotid: filteredSlots[0]._id,
//             slottype: filteredSlots[0].slottype,
//           }));

//           // fetch booked appointments
//           const apptTimes = await fetchBookedAppointments(
//             form.doctorid,
//             form.date
//           );

//           // ✅ merge breakTimes + booked appointment times
//           setBookedTimes([...new Set([...breakTimes, ...apptTimes])]);
//         } else {
//           setIntervals([]);
//           setBookedTimes([]);
//           setMessage(
//             "No slots available on this date. Please select another date."
//           );
//         }
//       } catch (err) {
//         console.error(err);
//         setIntervals([]);
//         setBookedTimes([]);
//         setMessage("Unable to fetch slots. Please try again later.");
//       }
//     })();
//   }, [form.doctorid, form.date, form.slottype]);

//   const onChange = (e) =>
//     setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

//   const onSelectInterval = ({ display, value }) => {
//     const start = parseTime(value);

//     const matchedSlot = availableSlots.find((slot) => {
//       const start = parseTime(slot.starttime);
//       const end = parseTime(slot.endtime);
//       const current = parseTime(value);
//       return current >= start && current < end;
//     });

//     const step = matchedSlot?.slottimerange
//       ? parseInt(matchedSlot.slottimerange, 10)
//       : 7;
//     const end = new Date(start.getTime() + step * 60000);

//     setForm((prev) => ({
//       ...prev,
//       slotid: matchedSlot?._id || prev.slotid,
//       starttime: value,
//       endtime: end.toISOString().slice(11, 16),
//     }));
//   };

//   const validate = () => {
//     if (!form.name.trim()) return "Please enter your full name.";
//     if (!/^\S+@\S+\.\S+$/.test(form.email))
//       return "Please enter a valid email.";
//     if (!/^\+?(\d{1,4})?[-.\s]?\d{10}$/.test(form.phone))
//       return "Please enter a valid phone (10 digits).";
//     if (!form.doctorid) return "Please choose a doctor.";
//     if (!form.date) return "Please select a date.";
//     if (!form.starttime) return "Please select a preferred time slot.";
//     return "";
//   };

//   const openRazorpay = async (orderData, appointmentId) => {
//     const ok = await loadRazorpay();
//     if (!ok) {
//       Swal.fire({
//         title: "Error",
//         text: "Failed to load payment gateway.",
//         icon: "error",
//       });
//       return;
//     }

//     const options = {
//       key: razorpayKey,
//       amount: orderData.amount,
//       currency: "INR",
//       name: "Doctor Appointment",
//       description: "Booking Fee",
//       order_id: orderData.orderId,
//       handler: async function (response) {
//         try {
//           const verifyRes = await fetch(`${base_url}/api/user/payment/verify`, {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({
//               appointmentid: appointmentId,
//               orderid: response.razorpay_order_id,
//               paymentid: response.razorpay_payment_id,
//               signature: response.razorpay_signature,
//             }),
//           });
//           const verifyData = await verifyRes.json();
//           if (!verifyData.error) {
//             Swal.fire({
//               title: "Payment Successful 🎉",
//               text: "Your appointment has been confirmed and paid.",
//               icon: "success",
//               confirmButtonText: "OK",
//             });
//             await fetchBookedAppointments(form.doctorid, form.date).then(
//               (apptTimes) => {
//                 setBookedTimes((prev) => [...new Set([...prev, ...apptTimes])]);
//               }
//             );

//             setForm((f) => ({
//               ...f,
//               name: "",
//               email: "",
//               phone: "",
//               date: today,
//               slotid: "",
//               starttime: "",
//               endtime: "",
//             }));
//           } else {
//             Swal.fire({
//               title: "Payment Verification Failed",
//               text: verifyData.message || "Please contact support.",
//               icon: "error",
//             });
//           }
//         } catch (err) {
//           console.error("Verification error:", err);
//           Swal.fire({
//             title: "Error",
//             text: "Unable to verify payment. Please contact support.",
//             icon: "error",
//           });
//         }
//       },
//       prefill: {
//         name: form.name,
//         email: form.email,
//         contact: form.phone,
//       },
//       theme: { color: "#13a4dd" },
//     };

//     const rzp = new window.Razorpay(options);
//     rzp.open();
//   };

//   const onSubmit = async (e) => {
//     e.preventDefault();
//     const err = validate();
//     if (err) {
//       Swal.fire({ title: "Missing Info", text: err, icon: "warning" });
//       return;
//     }

//     setSubmitting(true);
//     try {
//       const res = await fetch(`${base_url}/api/user/appointment/create`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           patientname: form.name,
//           patientemail: form.email,
//           patientmobile: form.phone,
//           doctorid: form.doctorid,
//           date: form.date,
//           slotid: form.slotid,
//           starttime: form.starttime,
//           endtime: form.endtime,
//           slottype: form.slottype,
//         }),
//       });
//       const data = await res.json();

//       if (data.error) {
//         Swal.fire({
//           title: "Failed",
//           text: data.message || "Something went wrong. Please try again.",
//           icon: "error",
//         });
//         setSubmitting(false);
//         return;
//       }

//       const appointmentId = data.data._id;

//       const orderRes = await fetch(`${base_url}/api/user/payment/order`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           appointmentid: appointmentId,
//           amount: 700,
//         }),
//       });
//       const orderData = await orderRes.json();

//       if (orderData.error) {
//         Swal.fire({
//           title: "Payment Failed",
//           text: orderData.message,
//           icon: "error",
//         });
//         setSubmitting(false);
//         return;
//       }

//       await openRazorpay(orderData.data, appointmentId);
//     } catch (error) {
//       console.error("Create appointment error:", error);
//       Swal.fire({
//         title: "Error",
//         text: "Unable to create appointment. Please try again later.",
//         icon: "error",
//       });
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const fade = {
//     hidden: { opacity: 0, y: 12 },
//     show: { opacity: 1, y: 0, transition: { duration: 0.45 } },
//   };

//   return (
//     <section
//       id="appointment"
//       className="af-root"
//       role="region"
//       aria-labelledby="book-title"
//     >
//       <div className="af-container">
//         <motion.div
//           className="af-left"
//           initial={{ opacity: 0, y: 14 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.45 }}
//         >
//           <span className="af-badge">Dr. Raoof’s Urocare</span>

//           <h2 id="book-title" className="af-heading">
//             Book Your Visit Online
//           </h2>

//           <p className="af-desc">
//             Consult <strong>Dr. Khizar Raoof</strong> for kidney stones,
//             prostate issues, and urinary concerns. Pick a date &amp; time that
//             works for you and confirm instantly with secure payment.
//           </p>

//           <div className="af-tags">
//             <span className="af-tag af-tag--primary">
//               Laser &amp; Laparoscopy
//             </span>
//             <span className="af-tag af-tag--secondary">Patient-First Care</span>
//           </div>

//           <img
//             className="af-side-illustration"
//             src="/assets/appointment form/appointment-form.png"
//             alt="Urology care illustration"
//             loading="eager"
//             decoding="async"
//           />
//         </motion.div>

//         {/* RIGHT: Form */}
//         <motion.form
//           className="af-form"
//           onSubmit={onSubmit}
//           noValidate
//           initial="hidden"
//           animate="show"
//           variants={{ show: { transition: { staggerChildren: 0.06 } } }}
//         >
//           <motion.div className="af-form-control" variants={fade}>
//             <label htmlFor="name">Full Name</label>
//             <input
//               id="name"
//               name="name"
//               type="text"
//               placeholder="Enter your full name"
//               value={form.name}
//               onChange={onChange}
//               required
//             />
//           </motion.div>

//           <motion.div className="af-form-control" variants={fade}>
//             <label htmlFor="email">Email</label>
//             <input
//               id="email"
//               name="email"
//               type="email"
//               placeholder="Enter your email"
//               value={form.email}
//               onChange={onChange}
//               required
//             />
//           </motion.div>

//           <motion.div className="af-form-control" variants={fade}>
//             <label htmlFor="phone">Phone</label>
//             <input
//               id="phone"
//               name="phone"
//               type="tel"
//               placeholder="Enter your phone number"
//               value={form.phone}
//               onChange={onChange}
//               required
//             />
//           </motion.div>

//           <motion.div className="af-form-control" variants={fade}>
//             <label htmlFor="doctorid">Select Doctor</label>
//             <select
//               id="doctorid"
//               name="doctorid"
//               value={form.doctorid}
//               onChange={onChange}
//               required
//             >
//               {doctors.map((doc) => (
//                 <option key={doc._id} value={doc._id}>
//                   {doc.name}
//                 </option>
//               ))}
//             </select>
//           </motion.div>

//           <motion.div className="af-form-control" variants={fade}>
//             <label htmlFor="date">Preferred Date</label>
//             <input
//               id="date"
//               name="date"
//               type="date"
//               min={today}
//               value={form.date}
//               onChange={onChange}
//               required
//             />
//           </motion.div>

//           <motion.div className="af-form-control af-radio" variants={fade}>
//             <div className="af-radio-group">
//               <input
//                 type="radio"
//                 id="slottype-offline"
//                 name="slottype"
//                 value="offline"
//                 checked={form.slottype === "offline"}
//                 onChange={onChange}
//               />
//               <label htmlFor="slottype-offline">Offline</label>
//             </div>
//             <div className="af-radio-group">
//               <input
//                 type="radio"
//                 id="slottype-online"
//                 name="slottype"
//                 value="online"
//                 checked={form.slottype === "online"}
//                 onChange={onChange}
//               />
//               <label htmlFor="slottype-online">Online</label>
//             </div>
//           </motion.div>

//           <motion.div className="af-form-control" variants={fade}>
//             <label>Preferred Time</label>
//             <div className="af-slots-container">
//               {/* {intervals.length === 0
//                 ? null
//                 : intervals.map(({ display, value }) => {
//                     const selected = form.starttime === value;
//                     const booked = bookedTimes.includes(value);
//                     return (
//                       <button
//                         key={value}
//                         type="button"
//                         onClick={() =>
//                           !booked && onSelectInterval({ display, value })
//                         }
//                         className={`af-slot-btn ${selected ? "selected" : ""} ${
//                           booked ? "disabled" : ""
//                         }`}
//                         disabled={booked}
//                         aria-pressed={selected}
//                         aria-label={`Time ${display}${
//                           booked ? " (booked)" : ""
//                         }`}
//                       >
//                         <FaCalendarAlt /> {display}
//                       </button>
//                     );
//                   })} */}
//               {intervals.length === 0
//                 ? null
//                 : intervals.map((time) => {
//                     const selected = form.starttime === time;
//                     const booked = bookedTimes.includes(time);
//                     return (
//                       <button
//                         key={time}
//                         type="button"
//                         onClick={() => {
//                           if (!booked) {
//                             const start = parseTime(time);
//                             const end = new Date(start.getTime() + 7 * 60000);
//                             setForm((prev) => ({
//                               ...prev,
//                               starttime: formatTime(start),
//                               endtime: formatTime(end),
//                             }));
//                           }
//                         }}
//                         className={`af-slot-btn ${selected ? "selected" : ""} ${
//                           booked ? "disabled" : ""
//                         }`}
//                         disabled={booked}
//                       >
//                         <FaCalendarAlt /> {time}
//                       </button>
//                     );
//                   })}
//             </div>
//           </motion.div>

//           {message && (
//             <motion.p className="af-status err" role="alert" variants={fade}>
//               {message}
//             </motion.p>
//           )}

//           <motion.button
//             className="af-submit"
//             type="submit"
//             disabled={submitting || !form.starttime}
//             aria-busy={submitting}
//             variants={fade}
//           >
//             {submitting ? "Processing…" : "Pay & Book"}
//           </motion.button>

//           <p className="af-fineprint">
//             By submitting, you agree to our{" "}
//             <a href="/privacy" className="af-link-secondary">
//               Privacy Policy
//             </a>
//             .
//           </p>
//         </motion.form>
//       </div>
//     </section>
//   );
// }

import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import { FaCalendarAlt } from "react-icons/fa";
import "../styles/AppointmentForm.css";
import { all } from "axios";

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
  const [availableSlots, setAvailableSlots] = useState([]);

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

  // const parseTime = (timeStr) => {
  //   if (!timeStr) return new Date();
  //   const [hours, minutes] = timeStr.split(":").map(Number);
  //   const d = new Date();
  //   d.setHours(hours, minutes, 0, 0);
  //   return d;
  // };

  const parseTime = (timeStr) => {
    if (!timeStr) return new Date();

    const [hours, minutes] = timeStr.split(":").map(Number);

    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setHours(hours, minutes, 0, 0);
    return d;
  };

  // Format back into "HH:mm"
  const formatTime = (dateObj) => dateObj.toISOString().slice(11, 16); // "HH:mm"

  // Generate intervals in 24h format
  const generateIntervals = (start, end, date, slotTimerange = 7) => {
    const out = [];
    const s = parseTime(start);
    const e = parseTime(end);
    const now = new Date();
    const isToday = date === today;

    while (s < e) {
      if (!isToday || s > now) {
        out.push(formatTime(new Date(s)));
      }
      s.setMinutes(s.getMinutes() + slotTimerange);
    }
    return out;
  };

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${base_url}/api/user/doctor/getall`);
        const data = await res.json();
        if (!data.error && data.data?.length) {
          setDoctors(data.data);
          setForm((prev) => ({
            ...prev,
            doctorid: data.data[0]._id,
            slottype: form.slottype,
          }));
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
        return data.data.appointments.map(
          (appt) => appt.starttime.slice(0, 5) // "HH:mm"
        );
      }
      return [];
    } catch {
      return [];
    }
  };

  useEffect(() => {
    (async () => {
      if (!form.doctorid || !form.date) {
        setIntervals([]);
        setBookedTimes([]);
        setMessage("Please select a date to see available slots.");
        return;
      }

      try {
        const res = await fetch(
          `${base_url}/api/user/slotbooking/${form.doctorid}?date=${form.date}`
        );
        const data = await res.json();

        if (!data.error && data.data?.length) {
          const filteredSlots = data.data.filter(
            (slot) => slot.slottype === form.slottype
          );

          if (!filteredSlots.length) {
            setIntervals([]);
            setBookedTimes([]);
            setMessage("No slots available for this type on this date.");
            return;
          }

          // ✅ generate all intervals
          let allIntervals = [];
          filteredSlots.forEach((slot) => {
            allIntervals = [
              ...allIntervals,
              ...generateIntervals(
                slot.starttime,
                slot.endtime,
                form.date,
                slot.slottimerange ? parseInt(slot.slottimerange, 10) : 7
              ),
            ];
          });

          setIntervals(allIntervals);
          console.log("allIntervals", allIntervals);
          setAvailableSlots(filteredSlots);
          console.log("filteredSlots", filteredSlots);
          setMessage("");

          // ✅ mark break times
          let breakTimes = [];
          filteredSlots.forEach((slot) => {
            slot.breaks?.forEach((b) => {
              const bs = parseTime(b.breakstart);
              const be = parseTime(b.breakend);

              allIntervals.forEach((time) => {
                const t = parseTime(time);
                if (t >= bs && t < be) {
                  breakTimes.push(time); // keep in HH:mm
                }
              });
            });
          });

          setForm((prev) => ({
            ...prev,
            slotid: filteredSlots[0]._id,
            slottype: filteredSlots[0].slottype,
          }));

          const apptTimes = await fetchBookedAppointments(
            form.doctorid,
            form.date
          );

          setBookedTimes([...new Set([...breakTimes, ...apptTimes])]);
        } else {
          setIntervals([]);
          setBookedTimes([]);
          setMessage(
            "No slots available on this date. Please select another date."
          );
        }
      } catch (err) {
        console.error(err);
        setIntervals([]);
        setBookedTimes([]);
        setMessage("Unable to fetch slots. Please try again later.");
      }
    })();
  }, [form.doctorid, form.date, form.slottype]);

  const onChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSelectInterval = (time) => {
    const start = parseTime(time);

    const matchedSlot = availableSlots.find((slot) => {
      const startSlot = parseTime(slot.starttime);
      const endSlot = parseTime(slot.endtime);
      const current = parseTime(time);
      return current >= startSlot && current < endSlot;
    });

    const step = matchedSlot?.slottimerange
      ? parseInt(matchedSlot.slottimerange, 10)
      : 7;
    const end = new Date(start.getTime() + step * 60000);

    setForm((prev) => ({
      ...prev,
      slotid: matchedSlot?._id || prev.slotid,
      starttime: time,
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
      amount: orderData.amount,
      currency: "INR",
      name: "Doctor Appointment",
      description: "Booking Fee",
      order_id: orderData.orderId,
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
            await fetchBookedAppointments(form.doctorid, form.date).then(
              (apptTimes) => {
                setBookedTimes((prev) => [...new Set([...prev, ...apptTimes])]);
              }
            );

            setForm((f) => ({
              ...f,
              name: "",
              email: "",
              phone: "",
              date: today,
              slotid: "",
              starttime: "",
              endtime: "",
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
      theme: { color: "#13a4dd" },
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

      const orderRes = await fetch(`${base_url}/api/user/payment/order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appointmentid: appointmentId,
          amount: 700,
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

          <motion.div className="af-form-control af-radio" variants={fade}>
            <div className="af-radio-group">
              <input
                type="radio"
                id="slottype-offline"
                name="slottype"
                value="offline"
                checked={form.slottype === "offline"}
                onChange={onChange}
              />
              <label htmlFor="slottype-offline">Offline</label>
            </div>
            <div className="af-radio-group">
              <input
                type="radio"
                id="slottype-online"
                name="slottype"
                value="online"
                checked={form.slottype === "online"}
                onChange={onChange}
              />
              <label htmlFor="slottype-online">Online</label>
            </div>
          </motion.div>

          <motion.div className="af-form-control" variants={fade}>
            <label>Preferred Time</label>
            <div className="af-slots-container">
              {intervals.length === 0
                ? null
                : intervals.map((time) => {
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
                      >
                        <FaCalendarAlt /> {time}
                      </button>
                    );
                  })}
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
