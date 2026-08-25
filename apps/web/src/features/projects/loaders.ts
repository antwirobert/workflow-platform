import { queryClient } from "@/app/queryClient";
import type { LoaderFunctionArgs } from "react-router-dom";
import { projectsApi } from "./api";

export function projectLoader({ params }: LoaderFunctionArgs) {
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
}
