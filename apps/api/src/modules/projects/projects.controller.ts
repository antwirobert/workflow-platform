import { Response, NextFunction } from "express";
import {
  CreateProjectPayload,
  ListProjectsQueryInput,
  UpdateProjectPayload,
} from "./projects.schemas";
import { projectsService } from "./projects.service";
import { AuthenticatedRequest } from "../../middleware/authenticate";

export class ProjectsController {
  create = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { name, slug, description } = req.validated!
        .body as CreateProjectPayload;

      const project = await projectsService.create({
        name,
        slug,
        description,
        workspaceId: req.workspace!.id,
      });

      res.status(201).json(project);
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
      const { page, limit } = req.validated!.query as ListProjectsQueryInput;

      const projects = await projectsService.list({
        page,
        limit,
        workspaceId: req.workspace!.id,
      });

      res.status(200).json(projects);
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
      const project = await projectsService.getById(
        req.workspace!.id,
        req.project!.id,
      );

      res.status(200).json(project);
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
      const { name, slug, description } = req.validated!
        .body as UpdateProjectPayload;

      const project = await projectsService.update({
        workspaceId: req.workspace!.id,
        projectId: req.project!.id,
        name,
        slug,
        description,
      });

      res.status(200).json(project);
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
      await projectsService.delete(req.organization!.id, req.workspace!.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}

export const projectsController = new ProjectsController();
