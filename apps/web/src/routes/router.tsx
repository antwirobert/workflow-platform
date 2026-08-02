import { createBrowserRouter, Navigate } from "react-router";
import ProtectedLayout from "./ProtectedLayout";
import RegisterPage from "@/features/auth/pages/RegisterPage";
import LoginPage from "@/features/auth/pages/LoginPage";
import OrganizationsPage from "@/features/organizations/pages/OrganizationsPage";
import WorkspacesPage from "@/features/workspaces/pages/WorkspacesPage";

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
        handle: { title: "Dashboard" },
      },
      {
        path: "/organizations",
        element: <OrganizationsPage />,
        handle: { title: "Organizations" },
      },
      {
        path: "/organizations/:orgId/workspaces",
        element: <WorkspacesPage />,
        handle: { title: "Workspaces" },
      },
    ],
  },
]);
