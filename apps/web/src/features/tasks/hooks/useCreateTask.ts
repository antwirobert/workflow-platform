import { useMutation, useQueryClient } from "@tanstack/react-query";
import { tasksApi } from "../api";
import type { CreateTaskPaylaod } from "../types";

export function useCreateTask(
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
    mutationFn: (payload: CreateTaskPaylaod) =>
      tasksApi.create(
        orgId as string,
        workspaceId as string,
        projectId as string,
        payload,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: listKey });
    },
  });
}
