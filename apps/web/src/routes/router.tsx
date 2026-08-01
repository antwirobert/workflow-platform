import { createBrowserRouter, Navigate } from "react-router";
import ProtectedLayout from "./ProtectedLayout";
import RegisterPage from "@/features/auth/pages/RegisterPage";
import LoginPage from "@/features/auth/pages/LoginPage";

export const router = createBrowserRouter([
  { path: "/", element: <Navigate to="/dashboard" replace /> },
  { path: "/register", element: <RegisterPage /> },
  { path: "/login", element: <LoginPage /> },
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
