export interface SendInvitationPayload {
  email: string;
  role: "ADMIN" | "MEMBER";
}

export interface AcceptInvitationResponse {
  message: string;
}

export interface InvitationParams {
  token: string;
}
