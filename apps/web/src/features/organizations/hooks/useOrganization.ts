import { useQuery } from "@tanstack/react-query";
import { organizationsApi } from "../api";

export function useOrganization(orgSlug: string | null) {
  return useQuery({
    queryKey: ["organizations", orgSlug],
    queryFn: () => organizationsApi.getById(orgSlug as string),
    enabled: !!orgSlug,
  });
}
