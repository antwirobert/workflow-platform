import { useQuery } from "@tanstack/react-query";
import { workspacesApi } from "../api";
import type { WorkspacelistParams } from "../types";

export function useWorkspaces(
  orgId: string | null,
  filters: WorkspacelistParams,
) {
  return useQuery({
    queryKey: ["organizations", orgId, "workspaces", filters],
    queryFn: () => workspacesApi.list(orgId as string, filters),
    enabled: !!orgId,
  });
}
