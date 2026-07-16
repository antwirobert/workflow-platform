import { NextFunction, Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { OrgIdParamInput } from "../modules/organizations/organizations.schemas";
import { AuthenticatedRequest } from "./authenticate";
import { NotFoundError } from "../common/errors";

export const assertOrgMembership = async (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction,
) => {
  const { orgId: organizationId } = req.validated!.params as OrgIdParamInput;
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

  next();
};
