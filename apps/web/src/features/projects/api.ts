import { apiClient } from "@/lib/api/client";
import type {
  CreateProjectPayload,
  PaginatedResponse,
  ProjectAssignee,
  ProjectlistParams,
  UpdateProjectPayload,
} from "./types";
import type { Project } from "@/types/project";

const base = (orgSlug: string, workspaceSlug: string) =>
  `/api/organizations/${orgSlug}/workspaces/${workspaceSlug}/projects/`;

export const projectsApi = {
  create: (
    orgSlug: string,
    workspaceSlug: string,
    payload: CreateProjectPayload,
  ) => apiClient.post<Project>(base(orgSlug, workspaceSlug), payload),
  list: (orgSlug: string, workspaceSlug: string, params: ProjectlistParams) =>
    apiClient.get<PaginatedResponse<Project>>(base(orgSlug, workspaceSlug), {
      params: {
        page: String(params.page),
        limit: String(params.limit),
      },
    }),
  getById: (orgSlug: string, workspaceSlug: string, projectSlug: string) =>
    apiClient.get<Project>(`${base(orgSlug, workspaceSlug)}${projectSlug}`),
  update: (
    orgSlug: string,
    workspaceSlug: string,
    projectSlug: string,
    payload: UpdateProjectPayload,
  ) =>
    apiClient.patch<Project>(
      `${base(orgSlug, workspaceSlug)}${projectSlug}`,
      payload,
    ),
  delete: (orgSlug: string, workspaceSlug: string, projectSlug: string) =>
    apiClient.delete<void>(`${base(orgSlug, workspaceSlug)}${projectSlug}`),
  listProjectAssignees: (
    orgSlug: string,
    workspaceSlug: string,
    projectSlug: string,
    params: ProjectlistParams,
  ) =>
    apiClient.get<PaginatedResponse<ProjectAssignee>>(
      `${base(orgSlug, workspaceSlug)}${projectSlug}/assignees`,
      {
        params: {
          page: String(params.page),
          limit: String(params.limit),
        },
      },
    ),
};
