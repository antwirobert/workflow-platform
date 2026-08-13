import { apiClient } from "@/lib/api/client";
import type { Workspace } from "@/types/workspace";
import type { CreateWorkspacePayload } from "./types";

const base = (orgSlug: string) => `/api/organizations/${orgSlug}/workspaces/`;

export const workspacesApi = {
  create: (orgSlug: string, payload: CreateWorkspacePayload) =>
    apiClient.post<Workspace>(base(`${orgSlug}`), payload),
  list: (orgSlug: string) => apiClient.get<Workspace[]>(base(`${orgSlug}`)),
  getById: (orgSlug: string, workspaceSlug: string) =>
    apiClient.get<Workspace>(base(`${orgSlug}${workspaceSlug}`)),
};
