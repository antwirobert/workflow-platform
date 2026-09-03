import { useMutation, useQueryClient } from "@tanstack/react-query";
import { tasksApi } from "../api";

export function useDeleteTask(
  orgSlug: string,
  workspaceSlug: string,
  projectSlug: string,
) {
  const queryClient = useQueryClient();
  const workspaceKey = ["organizations", orgSlug, "workspaces", workspaceSlug];

  return useMutation({
    mutationFn: (taskId: string) =>
      tasksApi.delete(
        orgSlug as string,
        workspaceSlug as string,
        projectSlug as string,
        taskId,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: workspaceKey });
    },
  });
}
