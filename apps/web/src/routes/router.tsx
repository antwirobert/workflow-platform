import { createBrowserRouter, Navigate } from "react-router";
import ProtectedLayout from "./ProtectedLayout";

export const router = createBrowserRouter([
  { path: "/", element: <Navigate to="/dashboard" replace /> },
  { path: "/register", element: <p>Register</p> },
  { path: "/login", element: <p>Login</p> },
  {
    element: <ProtectedLayout />,
    children: [
      {
        path: "/dashboard",
        element: <p>Dashboard</p>,
      },
    ],
  },
]);
