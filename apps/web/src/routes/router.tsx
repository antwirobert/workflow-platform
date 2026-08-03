import { createBrowserRouter, Navigate } from "react-router";
import ProtectedLayout from "./ProtectedLayout";
import RegisterPage from "@/features/auth/pages/RegisterPage";
import LoginPage from "@/features/auth/pages/LoginPage";
import OrganizationsPage from "@/features/organizations/pages/OrganizationsPage";
import WorkspacesPage from "@/features/workspaces/pages/WorkspacesPage";
import ProjectsPage from "@/features/projects/pages/ProjectsPage";
import ProjectTasksPage from "@/features/projects/pages/ProjectTasksPage";

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
      {
        path: "/organizations/:orgId/workspaces/:workspaceId",
        element: <div>Workspace Detail Page</div>,
        handle: { title: "Workspaces" },
      },
      {
        path: "/organizations/:orgId/workspaces/:workspaceId/projects",
        element: <ProjectsPage />,
        handle: { title: "Workspaces" },
      },
      {
        path: "/organizations/:orgId/workspaces/:workspaceId/projects/:projectId",
        element: <ProjectTasksPage />,
        handle: { title: "Projects" },
      },
    ],
  },
]);
