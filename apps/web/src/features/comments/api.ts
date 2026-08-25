import { apiClient } from "@/lib/api/client";
import type { CreateCommentPayload } from "./types";
import type { Comment } from "@/types/comment";

const base = (
  orgSlug: string,
  workspaceSlug: string,
  projectSlug: string,
  taskId: string,
) =>
  `/api/organizations/${orgSlug}/workspaces/${workspaceSlug}/projects/${projectSlug}/tasks/${taskId}/comments/`;

export const commentsApi = {
  create: (
    orgSlug: string,
    workspaceSlug: string,
    projectSlug: string,
    taskId: string,
    payload: CreateCommentPayload,
  ) =>
    apiClient.post<Comment>(
      base(orgSlug, workspaceSlug, projectSlug, taskId),
      payload,
    ),

  list: (
    orgSlug: string,
    workspaceSlug: string,
    projectSlug: string,
    taskId: string,
  ) =>
    apiClient.get<Comment>(base(orgSlug, workspaceSlug, projectSlug, taskId)),

  delete: (
    orgSlug: string,
    workspaceSlug: string,
    projectSlug: string,
    taskId: string,
    commentId: string,
  ) =>
    apiClient.delete<void>(
      `${base(orgSlug, workspaceSlug, projectSlug, taskId)}${commentId}`,
    ),
};
