import { NavLink, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaUserMd,
  FaCalendarCheck,
  FaSignOutAlt,
  FaHeadSideMask,
  FaCreditCard,
} from "react-icons/fa";
import { FaRegClock } from "react-icons/fa";
import { MdOutlinePrivacyTip } from "react-icons/md";

import "../styles/Sidebar.css";

export default function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("admin-auth");
    window.dispatchEvent(new Event("storage"));
    navigate("/admin");
  };

  return (
    <aside className="sb-root">
      <h2 className="sb-logo">
        <a href="/">
          <img src="/assets/navbar/logo.png" alt="Urocare Admin" />
        </a>
      </h2>
      <nav className="sb-nav">
        <NavLink to="/admin/dashboard" end>
          <FaHome /> Dashboard
        </NavLink>
        <NavLink to="/admin/patient-registration" end>
          <FaHeadSideMask /> Patient Registration
        </NavLink>
        <NavLink to="/admin/doctors">
          <FaUserMd /> Doctors
        </NavLink>
        <NavLink to="/admin/appointment-slots">
          <FaRegClock /> Slots
        </NavLink>
        <NavLink to="/admin/appointments">
          <FaCalendarCheck /> Appointments
        </NavLink>
        <NavLink to="/admin/payment">
          <FaCreditCard /> Payment
        </NavLink>
        <NavLink to="/admin/policies">
          <MdOutlinePrivacyTip /> Privacy Policy
        </NavLink>

        <button className="sb-logout" onClick={handleLogout}>
          <FaSignOutAlt /> Logout
        </button>
      </nav>
    </aside>
  );
}
