import { useQuery } from "@tanstack/react-query";
import { workspacesApi } from "../api";

export function useWorkspaces(orgSlug: string | null) {
  return useQuery({
    queryKey: ["organizations", orgSlug, "workspaces"],
    queryFn: () => workspacesApi.list(orgSlug as string),
    enabled: !!orgSlug,
  });
}
