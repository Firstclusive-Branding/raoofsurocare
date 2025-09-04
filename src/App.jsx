import { createBrowserRouter, RouterProvider } from "react-router-dom";
import SiteLayout from "./layouts/SiteLayout";
import AdminLayout from "./layouts/AdminLayout";
import Homepage from "./components/Homepage";
import Policies from "./components/Policies";
import AdminLogin from "./components/Admin/AdminLogin";

const router = createBrowserRouter([
  {
    path: "/",
    element: <SiteLayout />,
    children: [
      { index: true, element: <Homepage /> },
      { path: "privacy", element: <Policies /> },
    ],
  },
  {
    path: "/admin",
    element: <AdminLogin />, // login page
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      { path: "dashboard", element: <div>Admin Dashboard</div> },
      { path: "doctors", element: <div>Doctors Page</div> },
      { path: "appointments", element: <div>Appointments Page</div> },
      { path: "settings", element: <div>Settings Page</div> },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
