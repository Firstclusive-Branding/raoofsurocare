import { NavLink, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaUserMd,
  FaCalendarCheck,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";
import "../styles/Sidebar.css";

export default function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("admin-auth");
    // Trigger storage event manually for current tab
    window.dispatchEvent(new Event("storage"));
    navigate("/admin");
  };

  return (
    <aside className="sb-root">
      <h2 className="sb-logo">
        <img src="/assets/navbar/logo.png" alt="Urocare Admin" />
      </h2>
      <nav className="sb-nav">
        <NavLink to="/admin/dashboard" end>
          <FaHome /> Dashboard
        </NavLink>
        <NavLink to="/admin/doctors">
          <FaUserMd /> Doctors
        </NavLink>
        <NavLink to="/admin/appointments">
          <FaCalendarCheck /> Appointments
        </NavLink>
        <NavLink to="/admin/settings">
          <FaCog /> Settings
        </NavLink>
        <button className="sb-logout" onClick={handleLogout}>
          <FaSignOutAlt /> Logout
        </button>
      </nav>
    </aside>
  );
}
