import { apiClient } from "@/lib/api/client";
import type {
  CreateProjectPaylaod,
  PaginatedResponse,
  ProjectlistParams,
} from "./types";
import type { Project } from "@/types/project";

const base = (orgSlug: string, workspaceSlug: string) =>
  `/api/organizations/${orgSlug}/workspaces/${workspaceSlug}/projects/`;

export const projectsApi = {
  create: (
    orgSlug: string,
    workspaceSlug: string,
    payload: CreateProjectPaylaod,
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
};
