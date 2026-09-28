import { queryClient } from "@/app/queryClient";
import type { LoaderFunctionArgs } from "react-router-dom";
import { projectsApi } from "./api";
import { throwIfNotFound } from "@/lib/api/throwIfNotFound";

export function projectLoader({ params }: LoaderFunctionArgs) {
  try {
    return queryClient.ensureQueryData({
      queryKey: [
        "organizations",
        params.orgSlug,
        "workspaces",
        params.workspaceSlug,
        "projects",
        params.projectSlug,
      ],
      queryFn: () =>
        projectsApi.getById(
          params.orgSlug as string,
          params.workspaceSlug as string,
          params.projectSlug as string,
        ),
    });
  } catch (error) {
    throwIfNotFound(error, "Organization");
  }
}
