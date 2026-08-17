import { useMutation, useQueryClient } from "@tanstack/react-query";
import { workspacesApi } from "../api";

export function useDeleteWorkspace(orgSlug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (workspaceSlug: string) =>
      workspacesApi.delete(orgSlug, workspaceSlug),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["organizations", orgSlug, "workspaces"],
      });
    },
  });
}
