import type { OrgRole } from "./organization";

type InvitationStatus = "PENDING" | "ACCEPTED" | "EXPIRED";

export interface Invitation {
  id: string;
  email: string;
  orgId: string;
  role: OrgRole;
  status: InvitationStatus;
  expiresAt: string;
  createdAt: string;
}
