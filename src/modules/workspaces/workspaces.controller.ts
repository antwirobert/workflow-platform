import { NextFunction, Response } from "express";
import { AuthenticatedRequest } from "../../middleware/authenticate";
import { workspacesService } from "./workspaces.service";
import {
  CreateWorkspaceBody,
  OrgIdParamInput,
  UpdateWorkspaceBody,
  WorkspaceDetailParamsInput,
} from "./workspaces.schemas";

export class WorkspacesController {
  create = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { orgId: organizationId } = req.validated!
        .params as OrgIdParamInput;
      const { name, slug } = req.validated!.body as CreateWorkspaceBody;

      const workspace = await workspacesService.create({
        name,
        slug,
        organizationId,
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
      const { orgId } = req.validated!.params as OrgIdParamInput;

      const workspaces = await workspacesService.list(orgId);
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
      const { orgId, workspaceId } = req.validated!
        .params as WorkspaceDetailParamsInput;

      const workspace = await workspacesService.getById(orgId, workspaceId);
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
      const { orgId: organizationId, workspaceId } = req.validated!
        .params as WorkspaceDetailParamsInput;
      const { name, slug } = req.validated!.body as UpdateWorkspaceBody;

      const workspace = await workspacesService.update({
        name,
        slug,
        organizationId,
        workspaceId,
      });
      res.status(200).json(workspace);
    } catch (error) {
      next(error);
    }
  };
}

export const workspacesController = new WorkspacesController();
