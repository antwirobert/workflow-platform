import { NextFunction, Response } from "express";
import { AuthenticatedRequest } from "../../middleware/authenticate";
import { workspacesService } from "./workspaces.service";
import {
  CreateWorkspacePayload,
  listWorkspacesQueryInput,
  UpdateWorkspacePayload,
} from "./workspaces.schemas";

export class WorkspacesController {
  create = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { name, slug } = req.validated!.body as CreateWorkspacePayload;

      const workspace = await workspacesService.create({
        name,
        slug,
        organizationId: req.organization!.id,
      });
      res.status(201).json(workspace);
    } catch (error) {
      next(error);
    }
  };

  list = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { page, limit, q } = req.validated!
        .query as listWorkspacesQueryInput;

      const workspaces = await workspacesService.list({
        page,
        limit,
        q,
        organizationId: req.organization!.id,
        userId: req.user!.userId,
      });
      res.status(200).json(workspaces);
    } catch (error) {
      next(error);
    }
  };

  getById = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const workspace = await workspacesService.getById(
        req.organization!.id,
        req.workspace!.id,
        req.user!.userId,
      );
      res.status(200).json(workspace);
    } catch (error) {
      next(error);
    }
  };

  update = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { name, slug } = req.validated!.body as UpdateWorkspacePayload;

      const workspace = await workspacesService.update({
        name,
        slug,
        organizationId: req.organization!.id,
        workspaceId: req.workspace!.id,
      });
      res.status(200).json(workspace);
    } catch (error) {
      next(error);
    }
  };

  delete = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      await workspacesService.delete(req.organization!.id, req.workspace!.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };

  listWorkspaceTasks = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { page, limit } = req.validated!.query as listWorkspacesQueryInput;

      const workspaceTasks = await workspacesService.listWorkspaceTasks({
        page,
        limit,
        workspaceId: req.workspace!.id,
      });
      res.status(200).json(workspaceTasks);
    } catch (error) {
      next(error);
    }
  };

  listWorkspaceMembers = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { page, limit } = req.validated!.query as listWorkspacesQueryInput;

      const workspaceMembers = await workspacesService.listWorkspaceMembers({
        page,
        limit,
        organizationId: req.organization!.id,
        workspaceId: req.workspace!.id,
      });
      res.status(200).json(workspaceMembers);
    } catch (error) {
      next(error);
    }
  };
}

export const workspacesController = new WorkspacesController();
