import z from "zod";
import { OrgRole } from "../../generated/prisma/enums";

export const sendInvitationSchema = z.object({
  email: z.string().trim().toLowerCase().email("Invalid email address"),
  role: z.nativeEnum(OrgRole).default("MEMBER"),
});

export const acceptInvitationSchema = z.object({
  token: z.string().trim().min(1, "Token is required"),
});

export type SendInvitationPayload = z.infer<typeof sendInvitationSchema>;
export type AcceptInvitationPayload = z.infer<typeof acceptInvitationSchema>;
