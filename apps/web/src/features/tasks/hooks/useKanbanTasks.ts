import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { tasksApi } from "../api";
import type { Task, TaskStatus } from "@/types/task";
import type { TasklistParams } from "../types";

export function useKanbanTasks(
  orgSlug: string | null,
  workspaceSlug: string | null,
  projectSlug: string | null,
  filters: TasklistParams,
) {
  const query = useQuery({
    queryKey: [
      "organizations",
      orgSlug,
      "workspaces",
      workspaceSlug,
      "projects",
      projectSlug,
      "tasks",
      "kanban",
      filters,
    ],
    queryFn: () =>
      tasksApi.list(
        orgSlug as string,
        workspaceSlug as string,
        projectSlug as string,
        filters,
      ),
    enabled: !!orgSlug && !!workspaceSlug && !!projectSlug,
    placeholderData: keepPreviousData,
  });

  const columns: Record<TaskStatus, Task[]> = {
    TODO: [],
    IN_PROGRESS: [],
    IN_REVIEW: [],
    DONE: [],
    CANCELLED: [],
  };

  query.data?.data.forEach((task) => {
    columns[task.status].push(task);
  });

  return { ...query, columns };
}
