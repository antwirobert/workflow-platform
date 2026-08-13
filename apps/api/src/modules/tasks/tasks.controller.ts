import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../../middleware/authenticate";
import {
  CreateTaskPayload,
  ListTasksQueryInput,
  TaskDetailParams,
  UpdateTaskPayload,
} from "./tasks.schemas";
import { tasksService } from "./tasks.service";

export class TasksController {
  create = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { title, description, status, priority, assigneeId, dueDate } = req
        .validated!.body as CreateTaskPayload;

      const task = await tasksService.create({
        projectId: req.project!.id,
        title,
        description,
        status,
        priority,
        assigneeId,
        createdById: req.user!.userId,
        dueDate,
      });

      res.status(201).json(task);
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
      const { page, limit, status, priority, assigneeId, sortBy, order } = req
        .validated!.query as ListTasksQueryInput;

      const tasks = await tasksService.list({
        page,
        limit,
        status,
        priority,
        assigneeId,
        sortBy,
        order,
        projectId: req.project!.id,
      });

      res.status(200).json(tasks);
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
      const { taskId } = req.validated!.params as TaskDetailParams;

      const task = await tasksService.getById(req.project!.id, taskId);
      res.status(200).json(task);
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
      const { taskId } = req.validated!.params as TaskDetailParams;
      const body = req.validated!.body as UpdateTaskPayload;

      const task = await tasksService.update({
        projectId: req.project!.id,
        taskId,
        ...body,
      });
      res.status(200).json(task);
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
      const { taskId } = req.validated!.params as TaskDetailParams;

      const task = await tasksService.delete(req.project!.id, taskId);
      res.status(200).json(task);
    } catch (error) {
      next(error);
    }
  };
}

export const tasksController = new TasksController();
