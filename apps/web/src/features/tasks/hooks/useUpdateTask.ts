import { useMutation, useQueryClient } from "@tanstack/react-query";
import { tasksApi } from "../api";
import type { UpdateTaskPayload } from "../types";
import type { Task } from "@/types/task";
import type { ApiError } from "@/lib/api/client";

export function useUpdateTask(
  orgSlug: string,
  workspaceSlug: string,
  projectSlug: string,
  taskId: string,
) {
  const queryClient = useQueryClient();
  const detailKey = [
    "organizations",
    orgSlug,
    "workspaces",
    workspaceSlug,
    "projects",
    projectSlug,
    "tasks",
    taskId,
  ];
  const projectKey = [
    "organizations",
    orgSlug,
    "workspaces",
    workspaceSlug,
    "projects",
    projectSlug,
  ];

  return useMutation<
    Task,
    ApiError,
    UpdateTaskPayload,
    { previousTask?: Task }
  >({
    mutationFn: (payload: UpdateTaskPayload) =>
      tasksApi.update(
        orgSlug as string,
        workspaceSlug as string,
        projectSlug as string,
        taskId as string,
        payload,
      ),
    onMutate: async (payload) => {
      await queryClient.cancelQueries({ queryKey: detailKey });

      const previousTask = queryClient.getQueryData<Task>(detailKey);

      if (previousTask) {
        const nextTask: Task = {
          ...previousTask,
          ...payload,
          dueDate:
            payload.dueDate === undefined
              ? previousTask.dueDate
              : payload.dueDate instanceof Date
                ? payload.dueDate.toISOString()
                : (payload.dueDate ?? null),
        };

        queryClient.setQueryData<Task>(detailKey, nextTask);
      }

      return { previousTask };
    },

    onError: (_err, _payload, context) => {
      if (context?.previousTask) {
        queryClient.setQueryData(detailKey, context.previousTask);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: [...projectKey, "tasks", taskId],
      });
      queryClient.invalidateQueries({ queryKey: [...projectKey, "tasks"] });
      queryClient.invalidateQueries({ queryKey: [...projectKey, "assignees"] });
    },
  });
}
