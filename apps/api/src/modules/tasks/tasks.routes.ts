import { Router } from "express";
import { tasksController } from "./tasks.controller";
import { validate } from "../../middleware/validate";
import {
  createTaskSchema,
  listTasksQuerySchema,
  taskDetailParamsSchema,
  updateTaskSchema,
} from "./tasks.schemas";
import commentsRouter from "../comments/comments.routes";
import filesRouter from "../files/files.routes";
import { assertTaskToProject } from "../../middleware/guards";
import { requireRole } from "../../middleware/requireRole";

const router = Router({ mergeParams: true });

router.post("/", validate(createTaskSchema), tasksController.create);

router.get("/", validate(listTasksQuerySchema, "query"), tasksController.list);

router.get(
  "/:taskId",
  validate(taskDetailParamsSchema, "params"),
  tasksController.getById,
);

router.patch(
  "/:taskId",
  validate(taskDetailParamsSchema, "params"),
  validate(updateTaskSchema),
  tasksController.update,
);

router.delete(
  "/:taskId",
  validate(taskDetailParamsSchema, "params"),
  requireRole("ADMIN"),
  tasksController.delete,
);

router.use(
  "/:taskId/comments",
  validate(taskDetailParamsSchema, "params"),
  assertTaskToProject,
  commentsRouter,
);

router.use(
  "/:taskId/files",
  validate(taskDetailParamsSchema, "params"),
  assertTaskToProject,
  filesRouter,
);

export default router;
