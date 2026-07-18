import { OrgRole } from "../generated/prisma/enums";
import { Response, NextFunction } from "express";
import { OrganizationIdParams } from "../modules/organizations/organizations.schemas";
import { ForbiddenError, NotFoundError } from "../common/errors";
import { prisma } from "../lib/prisma";
import { AuthenticatedRequest } from "./authenticate";

const ROLE_HIERARCHY: Record<OrgRole, number> = {
  MEMBER: 1,
  ADMIN: 2,
  OWNER: 3,
};

export const requireRole = (...roles: OrgRole[]) => {
  return async (
    _res: Response,
    req: AuthenticatedRequest,
    next: NextFunction,
  ) => {
    const { orgId: organizationId } = req.validated!
      .params as OrganizationIdParams;
    const userId = req.user!.userId;

    const membership = await prisma.organizationMember.findUnique({
      where: {
        organizationId_userId: {
          organizationId,
          userId,
        },
      },
    });

    if (!membership) {
      throw new NotFoundError("Organization");
    }

    const userLevel = ROLE_HIERARCHY[membership.role];
    const permissionLevel = Math.min(
      ...roles.map((role) => ROLE_HIERARCHY[role]),
    );

    if (userLevel < permissionLevel) {
      throw new ForbiddenError(
        "You do not have permission to access this resource",
      );
    }

    next();
  };
};
