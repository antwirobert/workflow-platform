import { useMutation, useQueryClient } from "@tanstack/react-query";
import { projectsApi } from "../api";

export function useDeleteProject(orgSlug: string, workspaceSlug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (projectSlug: string) =>
      projectsApi.delete(orgSlug, workspaceSlug, projectSlug),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          "organizations",
          orgSlug,
          "workspaces",
          workspaceSlug,
          "projects",
        ],
      });
    },
  });
}
