import { NavLink } from "react-router-dom";
import { FaHome, FaUserMd, FaCalendarCheck, FaCog } from "react-icons/fa";

export default function Sidebar() {
  return (
    <aside className="sb-root">
      <h2 className="sb-logo">Admin Panel</h2>
      <nav className="sb-nav">
        <NavLink to="/admin" end>
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
      </nav>
    </aside>
  );
}
