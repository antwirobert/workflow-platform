import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { SendInvitationPayload } from "../types";
import { invitationsApi } from "../api";
import type { ApiError } from "@/lib/api/client";
import type { Invitation } from "@/types/invitation";

export function useSendInvitation(orgSlug: string) {
  const queryClient = useQueryClient();

  return useMutation<Invitation, ApiError, SendInvitationPayload>({
    mutationFn: (payload: SendInvitationPayload) =>
      invitationsApi.send(orgSlug, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["organizations", orgSlug, "invitations", "pending"],
      });
    },
  });
}
