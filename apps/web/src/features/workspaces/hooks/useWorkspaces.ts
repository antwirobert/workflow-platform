import { useQuery } from "@tanstack/react-query";
import { workspacesApi } from "../api";
import type { WorkspacelistParams } from "../types";

export function useWorkspaces(orgSlug: string | null) {
  return useQuery({
    queryKey: ["organizations", orgSlug, "workspaces"],
    queryFn: () => workspacesApi.list(orgSlug as string),
    enabled: !!orgSlug,
  });
}
