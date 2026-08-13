import { useQuery } from "@tanstack/react-query";
import { workspacesApi } from "../api";

export function useWorkspace(
  orgSlug: string | null,
  workspaceSlug: string | null,
) {
  return useQuery({
    queryKey: ["organizations", orgSlug, "workspaces", workspaceSlug],
    queryFn: () =>
      workspacesApi.getById(orgSlug as string, workspaceSlug as string),
    enabled: !!orgSlug && !!workspaceSlug,
  });
}
