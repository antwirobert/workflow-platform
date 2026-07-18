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
import { authenticate } from "../../middleware/authenticate";
import {
  assertOrgMembership,
  assertProjectToWorkspace,
  assertTaskToProject,
  assertWorkspaceToOrg,
} from "../../middleware/guards";
import { commentTaskParamsSchema } from "../comments/comments.schemas";
import { taskFileParamsSchema } from "../files/files.schemas";
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
  validate(commentTaskParamsSchema, "params"),
  authenticate,
  assertOrgMembership,
  assertWorkspaceToOrg,
  assertProjectToWorkspace,
  assertTaskToProject,
  commentsRouter,
);

router.use(
  "/:taskId/files",
  validate(taskFileParamsSchema, "params"),
  authenticate,
  assertOrgMembership,
  assertWorkspaceToOrg,
  assertProjectToWorkspace,
  assertTaskToProject,
  filesRouter,
);

export default router;
