import { Router } from "express";
import { validate } from "../../middleware/validate";
import { workspacesController } from "./workspaces.controller";
import {
  listWorkspacesQuerySchema,
  workspaceCreateSchema,
  workspaceDetailParamsSchema,
  workspaceUpdateSchema,
} from "./workspaces.schemas";
import projectsRouter from "../projects/projects.routes";
import { assertWorkspaceToOrg } from "../../middleware/guards";
import { requireRole } from "../../middleware/requireRole";

const router = Router({ mergeParams: true });

router.post(
  "/",
  validate(workspaceCreateSchema),
  requireRole("ADMIN"),
  workspacesController.create,
);

router.get(
  "/",
  validate(listWorkspacesQuerySchema, "query"),
  workspacesController.list,
);

router.get(
  "/:workspaceSlug",
  validate(workspaceDetailParamsSchema, "params"),
  assertWorkspaceToOrg,
  workspacesController.getById,
);

router.get(
  "/:workspaceSlug/tasks",
  validate(workspaceDetailParamsSchema, "params"),
  validate(listWorkspacesQuerySchema, "query"),
  assertWorkspaceToOrg,
  workspacesController.listWorkspaceTasks,
);

router.get(
  "/:workspaceSlug/members",
  validate(workspaceDetailParamsSchema, "params"),
  validate(listWorkspacesQuerySchema, "query"),
  assertWorkspaceToOrg,
  workspacesController.listWorkspaceMembers,
);

router.patch(
  "/:workspaceSlug",
  validate(workspaceDetailParamsSchema, "params"),
  assertWorkspaceToOrg,
  validate(workspaceUpdateSchema),
  requireRole("ADMIN"),
  workspacesController.update,
);

router.delete(
  "/:workspaceSlug",
  validate(workspaceDetailParamsSchema, "params"),
  assertWorkspaceToOrg,
  requireRole("ADMIN"),
  workspacesController.delete,
);

// Mount nested projects router with strict tenancy validation middleware
router.use(
  "/:workspaceSlug/projects",
  validate(workspaceDetailParamsSchema, "params"),
  assertWorkspaceToOrg,
  projectsRouter,
);

export default router;
