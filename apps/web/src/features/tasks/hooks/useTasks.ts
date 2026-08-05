import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { tasksApi } from "../api";
import type { TasklistParams } from "../types";

export function useTasks(
  orgId: string | null,
  workspaceId: string | null,
  projectId: string | null,
  filters: TasklistParams,
) {
  const listKey = [
    "organizations",
    orgId,
    "workspaces",
    workspaceId,
    "projects",
    projectId,
    "tasks",
    filters,
  ];

  return useQuery({
    queryKey: listKey,
    queryFn: () =>
      tasksApi.list(
        orgId as string,
        workspaceId as string,
        projectId as string,
        filters,
      ),
    enabled: !!orgId && !!workspaceId && !!projectId,
    placeholderData: keepPreviousData,
  });
}
