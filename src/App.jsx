import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Homepage from "./components/Homepage";
import Policies from "./components/Policies";

const router = createBrowserRouter([
  { path: "/", element: <Homepage /> },
  { path: "/privacy", element: <Policies /> },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
