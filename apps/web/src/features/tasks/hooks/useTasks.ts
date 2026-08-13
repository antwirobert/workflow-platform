import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { tasksApi } from "../api";
import type { TasklistParams } from "../types";

export function useTasks(
  orgSlug: string | null,
  workspaceSlug: string | null,
  projectSlug: string | null,
  filters: TasklistParams,
) {
  const listKey = [
    "organizations",
    orgSlug,
    "workspaces",
    workspaceSlug,
    "projects",
    projectSlug,
    "tasks",
    filters,
  ];

  return useQuery({
    queryKey: listKey,
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
}
