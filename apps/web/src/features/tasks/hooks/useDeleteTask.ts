import { useMutation, useQueryClient } from "@tanstack/react-query";
import { tasksApi } from "../api";

export function useDeleteTask(
  orgId: string,
  workspaceId: string,
  projectId: string,
) {
  const queryClient = useQueryClient();
  const listKey = [
    "organizations",
    orgId,
    "workspaces",
    workspaceId,
    "projects",
    projectId,
    "tasks",
  ];

  return useMutation({
    mutationFn: (taskId: string) =>
      tasksApi.delete(
        orgId as string,
        workspaceId as string,
        projectId as string,
        taskId,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: listKey });
    },
  });
}
