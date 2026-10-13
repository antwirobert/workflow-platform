import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { invitationsApi } from "../api";

export function usePendingInvitations(orgSlug: string | null) {
  return useQuery({
    queryKey: ["organizations", orgSlug, "invitations", "pending"],
    queryFn: () => invitationsApi.pending(orgSlug as string),
    enabled: !!orgSlug,
    placeholderData: keepPreviousData,
  });
}
