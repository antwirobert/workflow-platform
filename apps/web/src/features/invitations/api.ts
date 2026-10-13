import { apiClient } from "@/lib/api/client";
import type { Invitation } from "@/types/invitation";
import type {
  AcceptInvitationResponse,
  InvitationParams,
  SendInvitationPayload,
} from "./types";

const base = (orgSlug: string) => `/api/organizations/${orgSlug}/invitations/`;

export const invitationsApi = {
  send: (orgSlug: string, payload: SendInvitationPayload) =>
    apiClient.post<Invitation>(base(orgSlug), payload),
  pending: (orgSlug: string) => apiClient.get<Invitation[]>(base(orgSlug)),
  accept: (params: InvitationParams) =>
    apiClient.get<AcceptInvitationResponse>(`/api/invitations/accept`, {
      params: {
        token: params.token,
      },
    }),
};
