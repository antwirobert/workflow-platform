import type { LoaderFunctionArgs } from "react-router-dom";
import { queryClient } from "@/app/queryClient";
import { organizationsApi } from "./api";

export function organizationLoader({ params }: LoaderFunctionArgs) {
  return queryClient.ensureQueryData({
    queryKey: ["organizations", params.orgSlug],
    queryFn: () => organizationsApi.getById(params.orgSlug as string),
  });
}
