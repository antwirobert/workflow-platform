import { prisma } from "./prisma";
import { OrganizationMember } from "../generated/prisma/client";

const THROTTLE_MS = 5 * 60 * 1000; // 5 minutes

export function touchOrgAccess(membership: OrganizationMember): void {
  const isStale =
    !membership.lastAccessedAt ||
    Date.now() - membership.lastAccessedAt.getTime() > THROTTLE_MS;

  if (!isStale) return;

  prisma.organizationMember
    .update({
      where: {
        organizationId_userId: {
          organizationId: membership.organizationId,
          userId: membership.userId,
        },
      },
      data: {
        lastAccessedAt: new Date(),
        accessCount: { increment: 1 },
      },
    })
    .catch((err) => {
      console.error("Failed to update org access tracking:", err);
    });
}
