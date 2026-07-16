import { Request, Response, NextFunction } from "express";
import {
  CreateProjectBody,
  ProjectDetailParamsInput,
  UpdateProjectBody,
  WorkspaceIdParamInput,
} from "./projects.schemas";
import { projectsService } from "./projects.service";

export class ProjectsController {
  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, slug, description } = req.validated!
        .body as CreateProjectBody;
      const { workspaceId } = req.validated!.params as WorkspaceIdParamInput;

      const project = await projectsService.create({
        name,
        slug,
        description,
        workspaceId,
      });

      res.status(201).json(project);
    } catch (error) {
      next(error);
    }
  };

  list = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { workspaceId } = req.validated!.params as WorkspaceIdParamInput;

      const projects = await projectsService.list(workspaceId);

      res.status(200).json(projects);
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { workspaceId, projectId } = req.validated!
        .params as ProjectDetailParamsInput;

      const project = await projectsService.getById(workspaceId, projectId);

      res.status(200).json(project);
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { workspaceId, projectId } = req.validated!
        .params as ProjectDetailParamsInput;

      const { name, slug, description } = req.validated!
        .body as UpdateProjectBody;

      const project = await projectsService.update({
        workspaceId,
        projectId,
        name,
        slug,
        description,
      });

      res.status(200).json(project);
    } catch (error) {
      next(error);
    }
  };
}

export const projectsController = new ProjectsController();
