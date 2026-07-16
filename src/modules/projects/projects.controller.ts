import { Request, Response, NextFunction } from "express";
import { CreateProjectBody, WorkspaceIdParamInput } from "./projects.schemas";
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
}

export const projectsController = new ProjectsController();
