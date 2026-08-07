import { apiClient } from "@/lib/api/client";
import type { Workspace } from "@/types/workspace";
import type {
  CreateWorkspacePayload,
  PaginatedResponse,
  WorkspacelistParams,
} from "./types";

const base = (orgId: string) => `/api/organizations/${orgId}/workspaces/`;

export const workspacesApi = {
  create: (orgId: string, payload: CreateWorkspacePayload) =>
    apiClient.post<Workspace>(base(`${orgId}`), payload),
  list: (orgId: string, params: WorkspacelistParams) =>
    apiClient.get<PaginatedResponse<Workspace>>(base(`${orgId}`), {
      params: {
        page: String(params.page),
        limit: String(params.limit),
      },
    }),
  getById: (orgId: string, workspaceId: string) =>
    apiClient.get<Workspace>(base(`${orgId}${workspaceId}`)),
};
