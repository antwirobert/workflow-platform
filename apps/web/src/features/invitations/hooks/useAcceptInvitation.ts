import { useQuery } from "@tanstack/react-query";
import { invitationsApi } from "../api";
import type { InvitationParams } from "../types";

export function useAcceptInvitation(filters: InvitationParams) {
  return useQuery({
    queryKey: ["invitations", "accepted", filters],
    queryFn: () => invitationsApi.accept(filters),
  });
}
