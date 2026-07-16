import { Router } from "express";
import { organizationsController } from "./organizations.controller";
import { authenticate } from "../../middleware/authenticate";
import { validate } from "../../middleware/validate";
import {
  createOrganizationSchema,
  orgIdParamSchema,
} from "./organizations.schemas";
import workspacesRouter from "../workspaces/workspaces.routes";
import { assertOrgMembership } from "../../middleware/guards";

const router = Router();

router.post(
  "/",
  authenticate,
  validate(createOrganizationSchema),
  organizationsController.create,
);

router.get("/", authenticate, organizationsController.list);

router.get(
  "/:orgId",
  authenticate,
  validate(orgIdParamSchema, "params"),
  organizationsController.getById,
);
router.use(
  "/:orgId/workspaces",
  authenticate,
  validate(orgIdParamSchema, "params"),
  assertOrgMembership,
  workspacesRouter,
);

export default router;
