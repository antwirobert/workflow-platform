import type { ApiError } from "@/lib/api/client";
import type { Project } from "@/types/project";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { projectsApi } from "../api";
import type { CreateProjectPaylaod } from "../types";
import { generateSlug } from "@/lib/utils";

export function useCreateProject(orgSlug: string, workspaceSlug: string) {
  const queryClient = useQueryClient();

  return useMutation<Project, ApiError, Omit<CreateProjectPaylaod, "slug">>({
    mutationFn: (payload: Omit<CreateProjectPaylaod, "slug">) =>
      projectsApi.create(orgSlug, workspaceSlug, {
        ...payload,
        slug: generateSlug(payload.name),
      }),
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
