import { useMutation, useQueryClient } from "@tanstack/react-query";
import { tasksApi } from "../api";
import type { Task, TaskStatus } from "@/types/task";
import type { PaginatedResponse } from "../types";

export function useUpdateTaskStatus(
  orgSlug: string,
  workspaceSlug: string,
  projectSlug: string,
) {
  const queryClient = useQueryClient();
  const kanbanKey = [
    "organizations",
    orgSlug,
    "workspaces",
    workspaceSlug,
    "projects",
    projectSlug,
    "tasks",
    "kanban",
  ];

  return useMutation({
    mutationFn: ({ taskId, status }: { taskId: string; status: TaskStatus }) =>
      tasksApi.update(orgSlug, workspaceSlug, projectSlug, taskId, { status }),

    // Runs BEFORE the request is sent
    onMutate: async ({ taskId, status }) => {
      await queryClient.cancelQueries({ queryKey: kanbanKey });

      const previous =
        queryClient.getQueryData<PaginatedResponse<Task>>(kanbanKey);

      queryClient.setQueryData<PaginatedResponse<Task>>(kanbanKey, (old) => {
        if (!old) return old;
        return {
          ...old,
          data: old.data.map((t) => (t.id === taskId ? { ...t, status } : t)),
        };
      });

      // Returned value becomes `context` in onError below
      return { previous };
    },

    // Only runs if the request actually fails
    onError: (_err, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(kanbanKey, context.previous);
      }
    },

    // Always runs after success or failure — reconcile with server truth
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: kanbanKey });
      queryClient.invalidateQueries({
        queryKey: [
          "organizations",
          orgSlug,
          "workspaces",
          workspaceSlug,
          "projects",
          projectSlug,
          "tasks",
        ],
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: ["organizations", orgSlug, "workspaces", workspaceSlug],
        exact: false,
      });
    },
  });
}
