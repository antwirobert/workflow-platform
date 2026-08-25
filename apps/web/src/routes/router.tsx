import { createBrowserRouter, Navigate, Outlet } from "react-router";
import ProtectedLayout from "./ProtectedLayout";
import RegisterPage from "@/features/auth/pages/RegisterPage";
import LoginPage from "@/features/auth/pages/LoginPage";
import OrganizationsPage from "@/features/organizations/pages/OrganizationsPage";
import WorkspacesPage from "@/features/workspaces/pages/WorkspacesPage";
import ProjectsPage from "@/features/projects/pages/ProjectsPage";
import ProjectTasksPage from "@/features/projects/pages/ProjectTasksPage";
import WorkspaceDetailPage from "@/features/workspaces/pages/WorkspaceDetailPage";
import OrganizationMembersPage from "@/features/organizations/pages/OrganizationMembersPage";
import { organizationLoader } from "@/features/organizations/loaders";
import { workspaceLoader } from "@/features/workspaces/loaders";

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
        element: <Outlet />,
        handle: { title: "Organizations" },
        children: [
          {
            index: true,
            element: <OrganizationsPage />,
          },
          {
            path: ":orgSlug",
            element: <Outlet />,
            loader: organizationLoader,
            handle: {
              title: (org: { name: string } | undefined) => org?.name ?? "…",
              clickable: false,
            },
            children: [
              {
                path: "members",
                element: <OrganizationMembersPage />,
                handle: { title: "Members" },
              },
            ],
          },
        ],
      },
      {
        path: "/organizations/:orgSlug/workspaces",
        element: <Outlet />,
        handle: { title: "Workspaces" },
        children: [
          { index: true, element: <WorkspacesPage /> },
          {
            path: ":workspaceSlug",
            element: <WorkspaceDetailPage />,
            loader: workspaceLoader,
            handle: {
              title: (workspace: { name: string } | undefined) =>
                workspace?.name ?? "…",
            },
          },
        ],
      },

      {
        path: "/organizations/:orgSlug/workspaces/:workspaceSlug/projects",
        element: <Outlet />,
        handle: { title: "Projects" },
        children: [
          { index: true, element: <ProjectsPage /> },
          {
            path: ":projectSlug",
            element: <ProjectTasksPage />,
            handle: { title: "Projects" },
          },
        ],
      },
    ],
  },
]);
