import { NextFunction, Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { OrganizationSlugParams } from "../modules/organizations/organizations.schemas";
import { AuthenticatedRequest } from "./authenticate";
import { NotFoundError } from "../common/errors";
import { TaskCommentParams } from "../modules/comments/comments.schemas";
import { WorkspaceDetailParams } from "../modules/workspaces/workspaces.schemas";
import { ProjectSlugParam } from "../modules/projects/projects.schemas";

export const assertOrgMembership = async (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction,
) => {
  const { orgSlug } = req.validated!.params as OrganizationSlugParams;
  const userId = req.user!.userId;

  const membership = await prisma.organizationMember.findFirst({
    where: {
      userId,
      organization: { slug: orgSlug },
    },
    include: { organization: true },
  });

  if (!membership) {
    throw new NotFoundError("Organization");
  }

  req.user!.orgRole = membership.role;
  req.organization = membership.organization;
  req.membership = membership;
  next();
};

export const assertWorkspaceToOrg = async (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction,
) => {
  const { workspaceSlug } = req.validated!.params as WorkspaceDetailParams;
  const organizationId = req.organization!.id;

  const workspace = await prisma.workspace.findFirst({
    where: { slug: workspaceSlug, organizationId },
  });

  if (!workspace) {
    throw new NotFoundError("Workspace");
  }

  req.workspace = workspace;
  next();
};

export const assertProjectToWorkspace = async (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction,
) => {
  const workspaceId = req.workspace!.id;
  const { projectSlug } = req.validated!.params as ProjectSlugParam;

  const project = await prisma.project.findFirst({
    where: { slug: projectSlug, workspaceId },
  });

  if (!project) {
    throw new NotFoundError("Project");
  }

  req.project = project;
  next();
};

export const assertTaskToProject = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const { projectId, taskId } = req.validated!.params as TaskCommentParams;

  const task = await prisma.task.findUnique({
    where: { id: taskId },
  });

  if (!task || task.projectId !== projectId) {
    throw new NotFoundError("Task");
  }

  next();
};
