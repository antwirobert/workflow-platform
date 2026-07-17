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
import { authenticate } from "../../middleware/authenticate";
import {
  assertOrgMembership,
  assertProjectToWorkspace,
  assertTaskToProject,
  assertWorkspaceToOrg,
} from "../../middleware/guards";
import { commentTaskParamsSchema } from "../comments/comments.schemas";

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
  tasksController.delete,
);

router.use(
  "/:taskId/comments",
  validate(commentTaskParamsSchema, "params"),
  authenticate,
  assertOrgMembership,
  assertWorkspaceToOrg,
  assertProjectToWorkspace,
  assertTaskToProject,
  commentsRouter,
);

export default router;
