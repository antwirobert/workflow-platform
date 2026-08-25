import { useMutation, useQueryClient } from "@tanstack/react-query";
import { commentsApi } from "../api";

export function useDeleteComment(
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

  return useMutation({
    mutationFn: (commentId: string) =>
      commentsApi.delete(
        orgSlug,
        workspaceSlug,
        projectSlug,
        taskId,
        commentId,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: commentKey });
    },
  });
}
