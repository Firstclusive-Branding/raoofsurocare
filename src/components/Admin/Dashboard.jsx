"use client";
import React, { useEffect, useState } from "react";
import {
  FaUserInjured,
  FaUserMd,
  FaCalendarAlt,
  FaClock,
} from "react-icons/fa";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
} from "chart.js";
import "../styles/Dashboard.css";

// register chart.js components
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement
);

export default function Dashboard() {
  const [stats, setStats] = useState({
    patients: 245,
    doctors: 18,
    slots: 320,
    appointments: 842,
  });

  const [recentPatients, setRecentPatients] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [doctorAvailability, setDoctorAvailability] = useState([]);
  const [slotUtilization, setSlotUtilization] = useState([]);
  const [slotTypeData, setSlotTypeData] = useState([]);

  useEffect(() => {
    setRecentPatients([
      {
        id: "p1",
        name: "Rahul Sharma",
        mobile: "9876543210",
        email: "rahul@example.com",
        area: "Hyderabad",
      },
      {
        id: "p2",
        name: "Aisha Khan",
        mobile: "9123456780",
        email: "aisha@example.com",
        area: "Secunderabad",
      },
      {
        id: "p3",
        name: "Vikram Singh",
        mobile: "9988776655",
        email: "vikram@example.com",
        area: "Banjara Hills",
      },
      {
        id: "p4",
        name: "Neha Gupta",
        mobile: "9812345678",
        email: "neha.gupta@example.com",
        area: "Jubilee Hills",
      },
      {
        id: "p5",
        name: "Imran Khan",
        mobile: "9876501234",
        email: "imran.khan@example.com",
        area: "Madhapur",
      },
      {
        id: "p6",
        name: "Priya Menon",
        mobile: "9123456712",
        email: "priya.menon@example.com",
        area: "Gachibowli",
      },
      {
        id: "p7",
        name: "Rohit Malhotra",
        mobile: "9988001122",
        email: "rohit.malhotra@example.com",
        area: "Kukatpally",
      },
      {
        id: "p8",
        name: "Farah Siddiqui",
        mobile: "9876123450",
        email: "farah.siddiqui@example.com",
        area: "Charminar",
      },
      {
        id: "p9",
        name: "Sandeep Reddy",
        mobile: "9845098765",
        email: "sandeep.reddy@example.com",
        area: "Hi-Tech City",
      },
      {
        id: "p10",
        name: "Anjali Verma",
        mobile: "9786543210",
        email: "anjali.verma@example.com",
        area: "Begumpet",
      },
      {
        id: "p11",
        name: "Amit Desai",
        mobile: "9012345678",
        email: "amit.desai@example.com",
        area: "Secunderabad",
      },
      {
        id: "p12",
        name: "Sana Ali",
        mobile: "9345098761",
        email: "sana.ali@example.com",
        area: "Mehdipatnam",
      },
      {
        id: "p13",
        name: "Vivek Kapoor",
        mobile: "9876012345",
        email: "vivek.kapoor@example.com",
        area: "Kompally",
      },
      {
        id: "p14",
        name: "Karan Mehta",
        mobile: "9823456789",
        email: "karan.mehta@example.com",
        area: "Miyapur",
      },
      {
        id: "p15",
        name: "Deepika Rao",
        mobile: "9867543210",
        email: "deepika.rao@example.com",
        area: "Ameerpet",
      },
      {
        id: "p16",
        name: "Ramesh Yadav",
        mobile: "9811122233",
        email: "ramesh.yadav@example.com",
        area: "Uppal",
      },
      {
        id: "p17",
        name: "Shalini Nair",
        mobile: "9798765432",
        email: "shalini.nair@example.com",
        area: "LB Nagar",
      },
      {
        id: "p18",
        name: "Aditya Varma",
        mobile: "9845671234",
        email: "aditya.varma@example.com",
        area: "Dilsukhnagar",
      },
      {
        id: "p19",
        name: "Meera Joshi",
        mobile: "9912345670",
        email: "meera.joshi@example.com",
        area: "Somajiguda",
      },
      {
        id: "p20",
        name: "Mohammed Faisal",
        mobile: "9877001122",
        email: "faisal.mohammed@example.com",
        area: "Malakpet",
      },
      {
        id: "p21",
        name: "Ritika Sharma",
        mobile: "9854321098",
        email: "ritika.sharma@example.com",
        area: "Sanathnagar",
      },
      {
        id: "p22",
        name: "Ajay Kulkarni",
        mobile: "9832114455",
        email: "ajay.kulkarni@example.com",
        area: "Attapur",
      },
      {
        id: "p23",
        name: "Sneha Choudhary",
        mobile: "9901234567",
        email: "sneha.choudhary@example.com",
        area: "Bowenpally",
      },
    ]);

    setUpcomingAppointments([
      {
        id: "a1",
        patient: "Rahul Sharma",
        doctor: "Dr. Ramesh Kumar",
        specialization: "Cardiologist",
        date: "2025-09-14",
        time: "10:00 AM - 10:30 AM",
        type: "offline",
        status: "confirmed",
      },
      {
        id: "a2",
        patient: "Aisha Khan",
        doctor: "Dr. Sneha Rao",
        specialization: "Dermatologist",
        date: "2025-09-14",
        time: "11:00 AM - 11:15 AM",
        type: "online",
        status: "pending",
      },
      {
        id: "a3",
        patient: "Vikram Singh",
        doctor: "Dr. Arjun Mehta",
        specialization: "Orthopedic",
        date: "2025-09-15",
        time: "09:00 AM - 09:20 AM",
        type: "offline",
        status: "completed",
      },
      {
        id: "a4",
        patient: "Priya Nair",
        doctor: "Dr. Priya Nair",
        specialization: "Pediatrician",
        date: "2025-09-15",
        time: "10:30 AM - 11:00 AM",
        type: "online",
        status: "confirmed",
      },
      {
        id: "a5",
        patient: "Sneha Rao",
        doctor: "Dr. Sneha Rao",
        specialization: "Dermatologist",
        date: "2025-09-16",
        time: "12:00 PM - 12:30 PM",
        type: "offline",
        status: "pending",
      },
      {
        id: "a6",
        patient: "Ramesh Kumar",
        doctor: "Dr. Ramesh Kumar",
        specialization: "Cardiologist",
        date: "2025-09-16",
        time: "01:00 PM - 01:30 PM",
        type: "online",
        status: "completed",
      },
      {
        id: "a7",
        patient: "Arjun Mehta",
        doctor: "Dr. Arjun Mehta",
        specialization: "Orthopedic",
        date: "2025-09-17",
        time: "02:00 PM - 02:30 PM",
        type: "offline",
        status: "confirmed",
      },
      {
        id: "a8",
        patient: "Priya Nair",
        doctor: "Dr. Priya Nair",
        specialization: "Pediatrician",
        date: "2025-09-17",
        time: "03:00 PM - 03:30 PM",
        type: "online",
        status: "pending",
      },
      {
        id: "a9",
        patient: "Sneha Rao",
        doctor: "Dr. Sneha Rao",
        specialization: "Dermatologist",
        date: "2025-09-18",
        time: "04:00 PM - 04:30 PM",
        type: "offline",
        status: "completed",
      },
      {
        id: "a10",
        patient: "Ramesh Kumar",
        doctor: "Dr. Ramesh Kumar",
        specialization: "Cardiologist",
        date: "2025-09-18",
        time: "05:00 PM - 05:30 PM",
        type: "online",
        status: "confirmed",
      },
    ]);

    setDoctorAvailability([
      {
        id: "d1",
        name: "Dr. Ramesh Kumar",
        specialization: "Cardiologist",
        slotsToday: 8,
        booked: 5,
      },
      {
        id: "d2",
        name: "Dr. Sneha Rao",
        specialization: "Dermatologist",
        slotsToday: 6,
        booked: 4,
      },
      {
        id: "d3",
        name: "Dr. Arjun Mehta",
        specialization: "Orthopedic",
        slotsToday: 10,
        booked: 7,
      },
      {
        id: "d4",
        name: "Dr. Priya Nair",
        specialization: "Pediatrician",
        slotsToday: 9,
        booked: 9,
      },
      {
        id: "d5",
        name: "Dr. Anil Kapoor",
        specialization: "General Physician",
        slotsToday: 7,
        booked: 6,
      },
      {
        id: "d6",
        name: "Dr. Kavita Sharma",
        specialization: "Gynecologist",
        slotsToday: 8,
        booked: 5,
      },
      {
        id: "d7",
        name: "Dr. Rajesh Verma",
        specialization: "Dentist",
        slotsToday: 5,
        booked: 3,
      },
      {
        id: "d8",
        name: "Dr. Neeraj Reddy",
        specialization: "Endocrinologist",
        slotsToday: 6,
        booked: 2,
      },
      {
        id: "d9",
        name: "Dr. Alok Sinha",
        specialization: "Psychiatrist",
        slotsToday: 7,
        booked: 4,
      },
      {
        id: "d10",
        name: "Dr. Swati Mishra",
        specialization: "Ophthalmologist",
        slotsToday: 8,
        booked: 6,
      },
      {
        id: "d11",
        name: "Dr. Manish Gupta",
        specialization: "Neurologist",
        slotsToday: 9,
        booked: 7,
      },
      {
        id: "d12",
        name: "Dr. Rekha Menon",
        specialization: "Oncologist",
        slotsToday: 5,
        booked: 2,
      },
      {
        id: "d13",
        name: "Dr. Karthik Iyer",
        specialization: "Orthopedic",
        slotsToday: 10,
        booked: 8,
      },
      {
        id: "d14",
        name: "Dr. Shreya Banerjee",
        specialization: "Dermatologist",
        slotsToday: 6,
        booked: 5,
      },
    ]);

    setSlotUtilization([
      { doctor: "R. Kumar", booked: 5, available: 3 },
      { doctor: "S. Rao", booked: 4, available: 2 },
      { doctor: "A. Mehta", booked: 7, available: 3 },
      { doctor: "P. Nair", booked: 9, available: 0 },
    ]);

    setSlotTypeData([
      { name: "Offline", value: 70 },
      { name: "Online", value: 30 },
    ]);
  }, []);

  const slotUtilizationData = {
    labels: slotUtilization.map((d) => d.doctor),
    datasets: [
      {
        label: "Booked",
        data: slotUtilization.map((d) => d.booked),
        backgroundColor: "#13a4dd",
      },
      {
        label: "Available",
        data: slotUtilization.map((d) => d.available),
        backgroundColor: "#28a745",
      },
    ],
  };

  const slotUtilizationOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      tooltip: { enabled: true },
    },
  };

  // chart.js dataset for slot type distribution (pie)
  const slotTypeChartData = {
    labels: slotTypeData.map((d) => d.name),
    datasets: [
      {
        data: slotTypeData.map((d) => d.value),
        backgroundColor: ["#13a4dd", "#ffc107"],
        borderWidth: 1,
      },
    ],
  };

  const slotTypeOptions = {
    responsive: true,
    maintainAspectRatio: false, // let you control height
    aspectRatio: 1.3, // smaller ratio = smaller pie
    plugins: {
      legend: { position: "bottom" },
    },
  };

  return (
    <div className="dashboard">
      <h2>Admin Dashboard</h2>

      {/* Summary Cards */}
      <div className="dashboard-cards">
        <div className="dashboard-card patients">
          <FaUserInjured className="icon" />
          <h3>{stats.patients}</h3>
          <p>Total Patients</p>
        </div>
        <div className="dashboard-card doctors">
          <FaUserMd className="icon" />
          <h3>{stats.doctors}</h3>
          <p>Total Doctors</p>
        </div>
        <div className="dashboard-card slots">
          <FaClock className="icon" />
          <h3>{stats.slots}</h3>
          <p>Total Slots</p>
        </div>
        <div className="dashboard-card appointments">
          <FaCalendarAlt className="icon" />
          <h3>{stats.appointments}</h3>
          <p>Total Appointments</p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="dashboard-grid">
        {/* Recent Patients */}
        <div className="dashboard-box recent">
          <h3>Recent Patients</h3>
          <div className="recent-table">
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Mobile</th>
                  <th>Email</th>
                  <th>Area</th>
                </tr>
              </thead>
              <tbody>
                {recentPatients.map((p) => (
                  <tr key={p.id}>
                    <td>{p.name}</td>
                    <td>{p.mobile}</td>
                    <td>{p.email}</td>
                    <td>{p.area}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Upcoming Appointments */}
        <div className="dashboard-box upcoming">
          <h3>Upcoming Appointments</h3>
          <div className="scrollable-table">
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Doctor</th>
                  <th>Spec.</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Type</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {upcomingAppointments.map((a) => (
                  <tr key={a.id}>
                    <td>{a.patient}</td>
                    <td>{a.doctor}</td>
                    <td>{a.specialization}</td>
                    <td>{a.date}</td>
                    <td>{a.time}</td>
                    <td>{a.type}</td>
                    <td>
                      <span className={`dashboard-status-badge ${a.status}`}>
                        {a.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Doctor Availability */}
        <div className="dashboard-box doctors-box">
          <h3>Doctor Availability Today</h3>
          <div className="scrollable-table">
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Spec.</th>
                  <th>Slots</th>
                  <th>Booked</th>
                  <th>Free</th>
                </tr>
              </thead>
              <tbody>
                {doctorAvailability.map((d) => (
                  <tr key={d.id}>
                    <td>{d.name}</td>
                    <td>{d.specialization}</td>
                    <td>{d.slotsToday}</td>
                    <td>{d.booked}</td>
                    <td>{d.slotsToday - d.booked}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Slot Utilization Chart */}
        <div className="dashboard-box slot-utilization">
          <h3>Slot Utilization</h3>
          <Bar data={slotUtilizationData} options={slotUtilizationOptions} />
        </div>

        {/* Slot Type Distribution Pie */}
        <div className="dashboard-box slot-type">
          <h3>Slot Type Distribution</h3>
          <div className="chart-container">
            <Pie data={slotTypeChartData} options={slotTypeOptions} />
          </div>
        </div>
      </div>
    </div>
  );
}
