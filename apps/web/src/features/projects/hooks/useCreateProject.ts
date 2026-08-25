import type { ApiError } from "@/lib/api/client";
import type { Project } from "@/types/project";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { projectsApi } from "../api";
import { generateSlug } from "@/lib/utils";
import type { CreateProjectPayload } from "../types";

export function useCreateProject(orgSlug: string, workspaceSlug: string) {
  const queryClient = useQueryClient();

  return useMutation<Project, ApiError, Omit<CreateProjectPayload, "slug">>({
    mutationFn: (payload: Omit<CreateProjectPayload, "slug">) =>
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
