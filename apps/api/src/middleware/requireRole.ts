import { Response, NextFunction } from "express";
import { OrgRole } from "../generated/prisma/enums";
import { prisma } from "../lib/prisma";
import { AuthenticatedRequest } from "./authenticate";
import { ForbiddenError } from "../common/errors";

const ROLE_HIERARCHY: Record<OrgRole, number> = {
  MEMBER: 1,
  ADMIN: 2,
  OWNER: 3,
};

export const requireRole = (...roles: OrgRole[]) => {
  return async (
    req: AuthenticatedRequest,
    _res: Response,
    next: NextFunction,
  ) => {
    try {
      const userId = req.user!.userId;

      const membership = await prisma.organizationMember.findUnique({
        where: {
          organizationId_userId: {
            organizationId: req.organization!.id,
            userId,
          },
        },
      });

      if (!membership) {
        return next(
          new ForbiddenError(
            "You do not have permission to perform this action.",
          ),
        );
      }

      const userLevel = ROLE_HIERARCHY[membership.role];
      const requiredLevel = Math.min(...roles.map((r) => ROLE_HIERARCHY[r]));

      if (userLevel < requiredLevel) {
        return next(
          new ForbiddenError(
            "You do not have permission to access this resource.",
          ),
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
