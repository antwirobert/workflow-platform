import { Router } from "express";
import { validate } from "../../middleware/validate";
import { workspacesController } from "./workspaces.controller";
import {
  workspaceCreateSchema,
  workspaceIdParamSchema,
  workspaceUpdateSchema,
} from "./workspaces.schemas";
import projectsRouter from "../projects/projects.routes";
import { authenticate } from "../../middleware/authenticate";
import {
  assertOrgMembership,
  assertWorkspaceToOrg,
} from "../../middleware/guards";

const router = Router({ mergeParams: true });

router.post("/", validate(workspaceCreateSchema), workspacesController.create);

router.get("/", workspacesController.list);

router.get(
  "/:workspaceId",
  validate(workspaceIdParamSchema, "params"),
  workspacesController.getById,
);

router.patch(
  "/:workspaceId",
  validate(workspaceIdParamSchema, "params"),
  validate(workspaceUpdateSchema),
  workspacesController.update,
);

router.use(
  "/:workspaceId/projects",
  authenticate,
  validate(workspaceIdParamSchema, "params"),
  assertOrgMembership,
  assertWorkspaceToOrg,
  projectsRouter,
);

export default router;
