import type { OrgRole } from "@/types/organization";

export interface SendInvitationPayload {
  email: string;
  role: OrgRole;
}

export interface AcceptInvitationResponse {
  message: string;
}

export interface InvitationParams {
  token: string;
}
