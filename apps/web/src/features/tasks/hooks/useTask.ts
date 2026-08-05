import { useQuery } from "@tanstack/react-query";
import { tasksApi } from "../api";

export function useTask(
  orgId: string | null,
  workspaceId: string | null,
  projectId: string | null,
  taskId: string | null,
) {
  const detailKey = [
    "organizations",
    orgId,
    "workspaces",
    workspaceId,
    "projects",
    projectId,
    "tasks",
    taskId,
  ];

  return useQuery({
    queryKey: detailKey,
    queryFn: () =>
      tasksApi.getById(
        orgId as string,
        workspaceId as string,
        projectId as string,
        taskId as string,
      ),
    enabled: !!orgId && !!workspaceId && !!projectId && !!taskId,
  });
}
