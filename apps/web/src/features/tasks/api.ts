import { apiClient } from "@/lib/api/client";
import type { Task } from "@/types/task";
import type {
  CreateTaskPaylaod,
  PaginatedResponse,
  TasklistParams,
  UpdateTaskPayload,
} from "./types";

const base = (orgSlug: string, workspaceSlug: string, projectSlug: string) =>
  `/api/organizations/${orgSlug}/workspaces/${workspaceSlug}/projects/${projectSlug}/tasks/`;

export const tasksApi = {
  create: (
    orgSlug: string,
    workspaceSlug: string,
    projectSlug: string,
    payload: CreateTaskPaylaod,
  ) => apiClient.post<Task>(base(orgSlug, workspaceSlug, projectSlug), payload),
  list: (
    orgSlug: string,
    workspaceSlug: string,
    projectSlug: string,
    params: TasklistParams,
  ) =>
    apiClient.get<PaginatedResponse<Task>>(
      base(orgSlug, workspaceSlug, projectSlug),
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
    orgSlug: string,
    workspaceSlug: string,
    projectSlug: string,
    taskId: string,
  ) =>
    apiClient.get<Task>(
      `${base(orgSlug, workspaceSlug, projectSlug)}${taskId}`,
    ),
  update: (
    orgSlug: string,
    workspaceSlug: string,
    projectSlug: string,
    taskId: string,
    payload: UpdateTaskPayload,
  ) =>
    apiClient.patch<Task>(
      `${base(orgSlug, workspaceSlug, projectSlug)}${taskId}`,
      payload,
    ),
  delete: (
    orgSlug: string,
    workspaceSlug: string,
    projectSlug: string,
    taskId: string,
  ) =>
    apiClient.delete<void>(
      `${base(orgSlug, workspaceSlug, projectSlug)}${taskId}`,
    ),
};
