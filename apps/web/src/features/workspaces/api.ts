import { apiClient } from "@/lib/api/client";
import type { Workspace } from "@/types/workspace";
import type {
  CreateWorkspacePayload,
  PaginatedResponse,
  UpdateWorkspacePayload,
  WorkspacelistParams,
} from "./types";
import type { Task } from "@/types/task";

const base = (orgSlug: string) => `/api/organizations/${orgSlug}/workspaces/`;

export const workspacesApi = {
  create: (orgSlug: string, payload: CreateWorkspacePayload) =>
    apiClient.post<Workspace>(base(orgSlug), payload),
  list: (orgSlug: string, params: WorkspacelistParams) =>
    apiClient.get<PaginatedResponse<Workspace>>(base(orgSlug), {
      params: {
        page: String(params.page),
        limit: String(params.limit),
        ...(params.search ? { q: params.search } : {}),
      },
    }),
  getById: (orgSlug: string, workspaceSlug: string) =>
    apiClient.get<Workspace>(`${base(orgSlug)}${workspaceSlug}`),
  update: (
    orgSlug: string,
    workspaceSlug: string,
    payload: UpdateWorkspacePayload,
  ) => apiClient.patch<Workspace>(`${base(orgSlug)}${workspaceSlug}`, payload),
  delete: (orgSlug: string, workspaceSlug: string) =>
    apiClient.delete<void>(`${base(orgSlug)}${workspaceSlug}`),
  listWorkspaceTasks: (
    orgSlug: string,
    workspaceSlug: string,
    params: WorkspacelistParams,
  ) =>
    apiClient.get<PaginatedResponse<Task>>(
      `${base(orgSlug)}${workspaceSlug}/tasks`,
      {
        params: {
          page: String(params.page),
          limit: String(params.limit),
        },
      },
    ),
};
