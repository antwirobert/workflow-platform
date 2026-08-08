import { useQuery } from "@tanstack/react-query";
import { organizationsApi } from "../api";

export function useOrganization(orgId: string | null) {
  return useQuery({
    queryKey: ["organizations", orgId],
    queryFn: () => organizationsApi.getById(orgId as string),
    enabled: !!orgId,
  });
}
