import { useQuery } from "@tanstack/react-query";
import { workspacesApi } from "../api";
import type { WorkspacelistParams } from "../types";

export function useWorkspaces(
  orgSlug: string | null,
  filters: WorkspacelistParams,
) {
  return useQuery({
    queryKey: ["organizations", orgSlug, "workspaces", filters],
    queryFn: () => workspacesApi.list(orgSlug as string, filters),
    enabled: !!orgSlug,
  });
}
