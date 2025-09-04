import { Outlet } from "react-router-dom";
import Sidebar from "../components/Admin/Sidebar";
import "../styles/AdminLayout.css";

export default function AdminLayout() {
  return (
    <div className="admin-root">
      <Sidebar />
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}
