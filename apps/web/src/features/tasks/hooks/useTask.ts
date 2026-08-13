import { useQuery } from "@tanstack/react-query";
import { tasksApi } from "../api";

export function useTask(
  orgSlug: string | null,
  workspaceSlug: string | null,
  projectSlug: string | null,
  taskId: string | null,
) {
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

  return useQuery({
    queryKey: detailKey,
    queryFn: () =>
      tasksApi.getById(
        orgSlug as string,
        workspaceSlug as string,
        projectSlug as string,
        taskId as string,
      ),
    enabled: !!orgSlug && !!workspaceSlug && !!projectSlug && !!taskId,
  });
}
