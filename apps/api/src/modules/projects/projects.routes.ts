import { Router } from "express";
import { projectsController } from "./projects.controller";
import { validate } from "../../middleware/validate";
import {
  createProjectSchema,
  listProjectsQuerySchema,
  projectDetailParamsSchema,
  updateProjectSchema,
} from "./projects.schemas";
import tasksRouter from "../tasks/tasks.routes";
import { assertProjectToWorkspace } from "../../middleware/guards";
import { requireRole } from "../../middleware/requireRole";

// Preserves req.params from parent routers
const router = Router({ mergeParams: true });

router.post(
  "/",
  validate(createProjectSchema),
  requireRole("ADMIN"),
  projectsController.create,
);

router.get(
  "/",
  validate(listProjectsQuerySchema, "query"),
  projectsController.list,
);

router.get(
  "/:projectSlug",
  validate(projectDetailParamsSchema, "params"),
  assertProjectToWorkspace,
  projectsController.getById,
);

router.get(
  "/:projectSlug/assignees",
  validate(projectDetailParamsSchema, "params"),
  validate(listProjectsQuerySchema, "query"),
  assertProjectToWorkspace,
  projectsController.listProjectAsssignees,
);

router.patch(
  "/:projectSlug",
  validate(projectDetailParamsSchema, "params"),
  assertProjectToWorkspace,
  validate(updateProjectSchema),
  requireRole("ADMIN"),
  projectsController.update,
);

router.delete(
  "/:projectSlug",
  validate(projectDetailParamsSchema, "params"),
  assertProjectToWorkspace,
  requireRole("ADMIN"),
  projectsController.delete,
);

// Cascading nested security checks for task access
router.use(
  "/:projectSlug/tasks",
  validate(projectDetailParamsSchema, "params"),
  assertProjectToWorkspace,
  tasksRouter,
);

export default router;
