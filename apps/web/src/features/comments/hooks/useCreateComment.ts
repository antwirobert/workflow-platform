import { useMutation, useQueryClient } from "@tanstack/react-query";
import { commentsApi } from "../api";
import type { ApiError } from "@/lib/api/client";
import type { Comment } from "@/types/comment";
import type { CreateCommentPayload } from "../types";

export function useCreateComment(
  orgSlug: string,
  workspaceSlug: string,
  projectSlug: string,
  taskId: string,
) {
  const queryClient = useQueryClient();
  const commentKey = [
    "organizations",
    orgSlug,
    "workspaces",
    workspaceSlug,
    "projects",
    projectSlug,
    "tasks",
    taskId,
    "comments",
  ];

  return useMutation<Comment, ApiError, CreateCommentPayload>({
    mutationFn: (payload: CreateCommentPayload) =>
      commentsApi.create(orgSlug, workspaceSlug, projectSlug, taskId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: commentKey });
    },
  });
}
