import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { workspacesApi } from "../api";
import type { WorkspacelistParams } from "../types";

export function useWorkspaceMembers(
  orgSlug: string | null,
  workspaceSlug: string | null,
  filters: WorkspacelistParams,
) {
  return useQuery({
    queryKey: [
      "organizations",
      orgSlug,
      "workspaces",
      workspaceSlug,
      "workspaceMembers",
      filters,
    ],
    queryFn: () =>
      workspacesApi.listWorkspaceMembers(
        orgSlug as string,
        workspaceSlug as string,
        filters,
      ),
    enabled: !!orgSlug && !!workspaceSlug,
    placeholderData: keepPreviousData,
  });
}
