import { createBrowserRouter, RouterProvider } from "react-router-dom";
import SiteLayout from "./layouts/SiteLayout";
import AdminLayout from "./layouts/AdminLayout";
import Homepage from "./components/Homepage";
import Policies from "./components/Policies";
import AdminLogin from "./components/Admin/AdminLogin";
import Dashboard from "./components/Admin/Dashboard";
import Doctors from "./components/Admin/Doctors";
import Appointments from "./components/Admin/Appointments";
import Slots from "./components/Admin/Slots";
import PatientRegistration from "./components/Admin/PatientRegistration";
import { ToastContainer } from "react-toastify";

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
    element: <AdminLogin />,
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      { path: "dashboard", element: <Dashboard /> },
      { path: "doctors", element: <Doctors /> },
      { path: "appointments", element: <Appointments /> },
      { path: "appointment-slots", element: <Slots /> },
      { path: "patient-registration", element: <PatientRegistration /> },
    ],
  },
]);

export default function App() {
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="colored"
      />
      <RouterProvider router={router} />
    </>
  );
}
