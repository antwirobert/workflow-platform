import { useMutation, useQueryClient } from "@tanstack/react-query";
import { tasksApi } from "../api";
import type { UpdateTaskPayload } from "../types";
import type { Task } from "@/types/task";

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
        queryClient.setQueryData<Task>(detailKey, {
          ...previousTask,
          ...payload,
        });
      }

      return { previousTask };
    },

    onError: (_err, _payload, context) => {
      if (context?.previousTask) {
        queryClient.setQueryData(detailKey, context.previousTask);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: detailKey });
      queryClient.invalidateQueries({ queryKey: listKey });
    },
  });
}
