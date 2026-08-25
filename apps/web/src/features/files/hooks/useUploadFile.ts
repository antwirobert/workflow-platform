import { useMutation, useQueryClient } from "@tanstack/react-query";
import { filesApi } from "../api";

export function useUploadFile(
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
    mutationFn: (file: File) =>
      filesApi.upload(orgId, workspaceId, projectId, taskId, file),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: key }),
  });
}
