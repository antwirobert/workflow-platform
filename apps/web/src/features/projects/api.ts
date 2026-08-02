import { apiClient } from "@/lib/api/client";
import type { CreateProjectPaylaod } from "./types";
import type { Project } from "@/types/project";

const base = (orgId: string, workspaceId: string) =>
  `/api/organizations/${orgId}/workspaces/${workspaceId}/projects/`;

export const projectsApi = {
  create: (orgId: string, workspaceId: string, payload: CreateProjectPaylaod) =>
    apiClient.post<Project>(base(orgId, workspaceId), payload),
  list: (orgId: string, workspaceId: string) =>
    apiClient.get<Project[]>(base(orgId, workspaceId)),
  getById: (orgId: string, workspaceId: string, projectId: string) =>
    apiClient.get<Project>(`${base(orgId, workspaceId)}${projectId}`),
};
