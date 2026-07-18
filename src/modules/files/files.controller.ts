import { NextFunction, Request, Response } from "express";
import { filesService } from "./files.service";
import { AuthenticatedRequest } from "../../middleware/authenticate";
import { fileTaskParams } from "./files.schemas";
import { ForbiddenError, NotFoundError } from "../../common/errors";

export class FilesController {
  upload = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const file = req.file;

      if (!file) {
        throw new NotFoundError("File");
      }

      const { taskId } = req.validated!.params as fileTaskParams;
      const uploadedById = req.user!.userId;

      const result = await filesService.upload(taskId, uploadedById, file);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  };

  list = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { taskId } = req.validated!.params as fileTaskParams;

      const files = await filesService.list(taskId);
      res.status(200).json(files);
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
      const { taskId, fileId } = req.validated!.params as fileTaskParams;
      const userId = req.user!.userId;
      const orgRole = req.user!.orgRole;

      if (!orgRole) {
        throw new ForbiddenError("Access denied. Organization role missing.");
      }

      await filesService.delete(fileId, taskId, userId, orgRole);
      res.sendStatus(204);
    } catch (error) {
      next(error);
    }
  };
}

export const filesController = new FilesController();
