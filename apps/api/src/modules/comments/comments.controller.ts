import { NextFunction, Request, Response } from "express";
import {
  CreateCommentPayload,
  TaskCommentRouteParams,
} from "./comments.schemas";
import { commentsService } from "./comments.service";
import { AuthenticatedRequest } from "../../middleware/authenticate";
import { ForbiddenError } from "../../common/errors";

export class CommentsController {
  create = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { body } = req.validated!.body as CreateCommentPayload;
      const { taskId } = req.validated!.params as TaskCommentRouteParams;
      const userId = req.user!.userId;

      const comment = await commentsService.create({
        body,
        taskId,
        authorId: userId,
      });
      res.status(201).json(comment);
    } catch (error) {
      next(error);
    }
  };

  list = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { taskId } = req.validated!.params as TaskCommentRouteParams;

      const comments = await commentsService.list(taskId);
      res.status(200).json(comments);
    } catch (error) {
      next(error);
    }
  };

  delete = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { taskId, commentId } = req.validated!
        .params as TaskCommentRouteParams;
      const userId = req.user!.userId;
      const orgRole = req.user!.orgRole;

      if (!orgRole) {
        throw new ForbiddenError("Access denied. Organization role missing.");
      }

      await commentsService.delete(commentId, taskId, userId, orgRole);
      res.sendStatus(204);
    } catch (error) {
      next(error);
    }
  };
}

export const commentsController = new CommentsController();
