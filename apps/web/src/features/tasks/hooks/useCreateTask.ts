import { useMutation, useQueryClient } from "@tanstack/react-query";
import { tasksApi } from "../api";
import type { CreateTaskPaylaod } from "../types";

export function useCreateTask(
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
    mutationFn: (payload: CreateTaskPaylaod) =>
      tasksApi.create(
        orgSlug as string,
        workspaceSlug as string,
        projectSlug as string,
        payload,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: listKey });
    },
  });
}
