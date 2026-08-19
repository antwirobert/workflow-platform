import { useMutation, useQueryClient } from "@tanstack/react-query";
import { tasksApi } from "../api";
import type { CreateTaskPaylaod } from "../types";
import type { Task } from "@/types/task";
import type { ApiError } from "@/lib/api/client";

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

  return useMutation<Task, ApiError, CreateTaskPaylaod>({
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
