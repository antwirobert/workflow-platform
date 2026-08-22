import { useQuery } from "@tanstack/react-query";
import { workspacesApi } from "../api";
import type { WorkspacelistParams } from "../types";

export function useWorkspaceTasks(
  orgSlug: string | null,
  workspaceSlug: string | null,
  filters: WorkspacelistParams,
) {
  return useQuery({
    queryKey: ["organizations", orgSlug, "workspaces", workspaceSlug, filters],
    queryFn: () =>
      workspacesApi.listWorkspaceTasks(
        orgSlug as string,
        workspaceSlug as string,
        filters,
      ),
    enabled: !!orgSlug && !!workspaceSlug,
  });
}
