import { apiClient } from "@/lib/api/client";
import type { Task } from "@/types/task";
import type {
  CreateTaskPaylaod,
  PaginatedResponse,
  TasklistParams,
  UpdateTaskPayload,
} from "./types";

const base = (orgId: string, workspaceId: string, projectId: string) =>
  `/api/organizations/${orgId}/workspaces/${workspaceId}/projects/${projectId}/tasks`;

export const tasksApi = {
  create: (
    orgId: string,
    workspaceId: string,
    projectId: string,
    payload: CreateTaskPaylaod,
  ) => apiClient.post<Task>(base(orgId, workspaceId, projectId), payload),
  list: (
    orgId: string,
    workspaceId: string,
    projectId: string,
    params: TasklistParams,
  ) =>
    apiClient.get<PaginatedResponse<Task>>(
      base(orgId, workspaceId, projectId),
      {
        params: {
          page: String(params.page),
          limit: String(params.limit),
          ...(params.status ? { status: params.status } : {}),
          ...(params.priority ? { priority: params.priority } : {}),
        },
      },
    ),
  getById: (
    orgId: string,
    workspaceId: string,
    projectId: string,
    taskId: string,
  ) => apiClient.get<Task>(`${base(orgId, workspaceId, projectId)}/${taskId}`),
  update: (
    orgId: string,
    workspaceId: string,
    projectId: string,
    taskId: string,
    payload: UpdateTaskPayload,
  ) =>
    apiClient.patch<Task>(
      `${base(orgId, workspaceId, projectId)}/${taskId}`,
      payload,
    ),
  delete: (
    orgId: string,
    workspaceId: string,
    projectId: string,
    taskId: string,
  ) =>
    apiClient.delete<void>(`${base(orgId, workspaceId, projectId)}/${taskId}`),
};
