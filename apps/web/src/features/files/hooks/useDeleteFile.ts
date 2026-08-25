import { useMutation, useQueryClient } from "@tanstack/react-query";
import { filesApi } from "../api";

export function useDeleteFile(
  orgSlug: string,
  workspaceSlug: string,
  projectSlug: string,
  taskId: string,
) {
  const queryClient = useQueryClient();
  const key = [
    "organizations",
    orgSlug,
    "workspaces",
    workspaceSlug,
    "projects",
    projectSlug,
    "tasks",
    taskId,
    "files",
  ];

  return useMutation({
    mutationFn: (fileId: string) =>
      filesApi.delete(orgSlug, workspaceSlug, projectSlug, taskId, fileId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: key }),
  });
}
