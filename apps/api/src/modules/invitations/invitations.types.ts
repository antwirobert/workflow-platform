import { SendInvitationPayload } from "./invitations.schemas";

export interface SendInvitationInput extends SendInvitationPayload {
  organizationId: string;
}

export interface InvitationResult {
  id: string;
  email: string;
  orgId: string;
  role: string;
  status: string;
  expiresAt: Date;
  createdAt: Date;
}
