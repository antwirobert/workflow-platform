import {
  BadRequestError,
  ConflictError,
  NotFoundError,
} from "../../common/errors";
import { Invitation } from "../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { InvitationResult, SendInvitationInput } from "./invitations.types";
import crypto from "crypto";

export class InvitationsService {
  async send(input: SendInvitationInput): Promise<InvitationResult> {
    const { email, role, organizationId } = input;

    const org = await prisma.organization.findUnique({
      where: { id: organizationId },
    });

    if (!org) {
      throw new NotFoundError("Organization");
    }

    const existingMember = await prisma.organizationMember.findFirst({
      where: {
        organizationId,
        user: {
          email,
        },
      },
    });

    if (existingMember) {
      throw new ConflictError("User is already a member of this organization");
    }

    const existingInvitation = await prisma.invitation.findFirst({
      where: { email, orgId: organizationId, status: "PENDING" },
    });

    if (existingInvitation) {
      throw new ConflictError(
        "An invitation has already been sent to this email",
      );
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    const invitation = await prisma.invitation.create({
      data: {
        email,
        orgId: organizationId,
        role,
        token,
        expiresAt,
      },
    });

    const inviteLink = `http://localhost:3000/api/invitations/accept?token=${token}`;
    console.log(`Invite link for ${email}: ${inviteLink}`);

    return this.buildInvitationResult(invitation);
  }

  async accept(token: string, userId: string) {
    const invitation = await prisma.invitation.findUnique({
      where: { token },
    });

    if (!invitation) {
      throw new NotFoundError("Invitation");
    }

    if (invitation.status !== "PENDING") {
      throw new BadRequestError(
        "This invitation is no longer active or pending.",
      );
    }

    if (invitation.expiresAt < new Date()) {
      await prisma.invitation.update({
        where: { id: invitation.id },
        data: { status: "EXPIRED" },
      });
      throw new BadRequestError("This invitation has expired");
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new NotFoundError("User");
    }

    if (user.email !== invitation.email) {
      throw new BadRequestError(
        "This invitation was sent to a different email address",
      );
    }

    const existingMember = await prisma.organizationMember.findUnique({
      where: {
        organizationId_userId: {
          organizationId: invitation.orgId,
          userId,
        },
      },
    });

    if (existingMember) {
      throw new ConflictError("You are already a member of this organization");
    }

    await prisma.$transaction([
      prisma.organizationMember.create({
        data: {
          userId,
          organizationId: invitation.orgId,
          role: invitation.role,
        },
      }),

      prisma.invitation.update({
        where: { id: invitation.id },
        data: { status: "ACCEPTED" },
      }),
    ]);

    return { message: "Invitation accepted successfully" };
  }

  async pending(organizationId: string) {
    const invitations = await prisma.invitation.findMany({
      where: { orgId: organizationId, status: "PENDING" },
      orderBy: { createdAt: "desc" },
    });

    return invitations.map((invitation) =>
      this.buildInvitationResult(invitation),
    );
  }

  private buildInvitationResult(invitation: Invitation): InvitationResult {
    return {
      id: invitation.id,
      email: invitation.email,
      orgId: invitation.orgId,
      role: invitation.role,
      status: invitation.status,
      expiresAt: invitation.expiresAt,
      createdAt: invitation.createdAt,
    };
  }
}

export const invitationsService = new InvitationsService();
