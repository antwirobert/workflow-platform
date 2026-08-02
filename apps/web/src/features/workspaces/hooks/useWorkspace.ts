import { useQuery } from "@tanstack/react-query";
import { workspacesApi } from "../api";

export function useWorkspace(orgId: string | null, workspaceId: string | null) {
  return useQuery({
    queryKey: ["organizations", orgId, "workspaces", workspaceId],
    queryFn: () =>
      workspacesApi.getById(orgId as string, workspaceId as string),
    enabled: !!orgId && !!workspaceId,
  });
}
