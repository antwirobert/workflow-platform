import { apiClient } from "@/lib/api/client";
import type { TaskFile } from "@/types/file";

const base = (
  orgSlug: string,
  workspaceSlug: string,
  projectSlug: string,
  taskId: string,
) =>
  `/api/organizations/${orgSlug}/workspaces/${workspaceSlug}/projects/${projectSlug}/tasks/${taskId}/files/`;

export const filesApi = {
  upload: (
    orgSlug: string,
    workspaceSlug: string,
    projectSlug: string,
    taskId: string,
    file: File,
  ) => {
    const formData = new FormData();
    formData.append("file", file);
    return apiClient.postForm<TaskFile>(
      base(orgSlug, workspaceSlug, projectSlug, taskId),
      formData,
    );
  },

  list: (
    orgSlug: string,
    workspaceSlug: string,
    projectSlug: string,
    taskId: string,
  ) =>
    apiClient.get<TaskFile>(base(orgSlug, workspaceSlug, projectSlug, taskId)),

  delete: (
    orgSlug: string,
    workspaceSlug: string,
    projectSlug: string,
    taskId: string,
    fileId: string,
  ) =>
    apiClient.delete<void>(
      `${base(orgSlug, workspaceSlug, projectSlug, taskId)}${fileId}`,
    ),
};
