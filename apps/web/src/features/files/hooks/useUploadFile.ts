import { useMutation, useQueryClient } from "@tanstack/react-query";
import { filesApi } from "../api";

export function useUploadFile(
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
    mutationFn: (file: File) =>
      filesApi.upload(orgSlug, workspaceSlug, projectSlug, taskId, file),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: key }),
  });
}
