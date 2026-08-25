import { useMutation, useQueryClient } from "@tanstack/react-query";
import { filesApi } from "../api";

export function useDeleteFile(
  orgId: string,
  workspaceId: string,
  projectId: string,
  taskId: string,
) {
  const queryClient = useQueryClient();
  const key = [
    "organizations",
    orgId,
    "workspaces",
    workspaceId,
    "projects",
    projectId,
    "tasks",
    taskId,
    "files",
  ];

  return useMutation({
    mutationFn: (fileId: string) =>
      filesApi.delete(orgId, workspaceId, projectId, taskId, fileId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: key }),
  });
}
