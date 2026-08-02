import { useQuery } from "@tanstack/react-query";
import { workspacesApi } from "../api";

export function useWorkspaces(orgId: string | null) {
  return useQuery({
    queryKey: ["organizations", orgId, "workspaces"],
    queryFn: () => workspacesApi.list(orgId as string),
    enabled: !!orgId,
  });
}
