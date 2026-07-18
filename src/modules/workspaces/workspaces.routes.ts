import { Router } from "express";
import { validate } from "../../middleware/validate";
import { workspacesController } from "./workspaces.controller";
import {
  workspaceCreateSchema,
  workspaceDetailParamsSchema,
  workspaceUpdateSchema,
} from "./workspaces.schemas";
import projectsRouter from "../projects/projects.routes";
import { authenticate } from "../../middleware/authenticate";
import {
  assertOrgMembership,
  assertWorkspaceToOrg,
} from "../../middleware/guards";
import { requireRole } from "../../middleware/requireRole";

const router = Router({ mergeParams: true });

router.post(
  "/",
  validate(workspaceCreateSchema),
  requireRole("ADMIN"),
  workspacesController.create,
);

router.get("/", workspacesController.list);

router.get(
  "/:workspaceId",
  validate(workspaceDetailParamsSchema, "params"),
  workspacesController.getById,
);

router.patch(
  "/:workspaceId",
  validate(workspaceDetailParamsSchema, "params"),
  validate(workspaceUpdateSchema),
  requireRole("ADMIN"),
  workspacesController.update,
);

// Mount nested projects router with strict tenancy validation middleware
router.use(
  "/:workspaceId/projects",
  authenticate,
  // Validate path parameters before passing control to subsequent route handlers
  validate(workspaceDetailParamsSchema, "params"),
  assertOrgMembership,
  assertWorkspaceToOrg,
  projectsRouter,
);

export default router;
