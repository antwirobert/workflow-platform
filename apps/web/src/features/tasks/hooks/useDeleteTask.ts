import { useMutation, useQueryClient } from "@tanstack/react-query";
import { tasksApi } from "../api";

export function useDeleteTask(
  orgSlug: string,
  workspaceSlug: string,
  projectSlug: string,
) {
  const queryClient = useQueryClient();
  const listKey = [
    "organizations",
    orgSlug,
    "workspaces",
    workspaceSlug,
    "projects",
    projectSlug,
    "tasks",
  ];

  return useMutation({
    mutationFn: (taskId: string) =>
      tasksApi.delete(
        orgSlug as string,
        workspaceSlug as string,
        projectSlug as string,
        taskId,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: listKey });
    },
  });
}
