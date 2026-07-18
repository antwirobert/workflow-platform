import { NextFunction, Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { OrganizationIdParams } from "../modules/organizations/organizations.schemas";
import { AuthenticatedRequest } from "./authenticate";
import { NotFoundError } from "../common/errors";
import { WorkspaceDetailParams } from "../modules/workspaces/workspaces.schemas";
import { ProjectTaskParams } from "../modules/tasks/tasks.schemas";
import { TaskCommentParams } from "../modules/comments/comments.schemas";

export const assertOrgMembership = async (
  req: AuthenticatedRequest,
  _res: Response,
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

  req.user!.orgRole = membership.role;

  next();
};

export const assertWorkspaceToOrg = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const { orgId: organizationId, workspaceId } = req.validated!
    .params as WorkspaceDetailParams;

  const workspace = await prisma.workspace.findUnique({
    where: { id: workspaceId },
  });

  if (!workspace || workspace.organizationId !== organizationId) {
    throw new NotFoundError("Workspace");
  }

  next();
};

export const assertProjectToWorkspace = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const { workspaceId, projectId } = req.validated!.params as ProjectTaskParams;

  const project = await prisma.project.findUnique({
    where: { id: projectId },
  });

  if (!project || project.workspaceId !== workspaceId) {
    throw new NotFoundError("Project");
  }

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
