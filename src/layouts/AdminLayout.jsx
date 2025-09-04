import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Sidebar from "../components/Admin/Sidebar";
import "../styles/AdminLayout.css";

export default function AdminLayout() {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      const isLoggedIn = localStorage.getItem("admin-auth") === "true";
      if (!isLoggedIn) navigate("/admin");
    };

    checkAuth();

    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, [navigate]);

  return (
    <div className="admin-root">
      <Sidebar />
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}
