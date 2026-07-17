import { Router } from "express";
import { organizationsController } from "./organizations.controller";
import { authenticate } from "../../middleware/authenticate";
import { validate } from "../../middleware/validate";
import {
  createOrganizationSchema,
  orgIdParamSchema,
} from "./organizations.schemas";
import workspacesRouter from "../workspaces/workspaces.routes";
import searchRouter from "../../search/search.routes";
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

// Mount nested workspaces router with strict tenancy validation middleware
router.use(
  "/:orgId/workspaces",
  // Validate path parameters before passing control to subsequent route handlers
  validate(orgIdParamSchema, "params"),
  authenticate,
  assertOrgMembership,
  workspacesRouter,
);

router.use(
  "/:orgId/search",
  validate(orgIdParamSchema, "params"),
  authenticate,
  assertOrgMembership,
  searchRouter,
);

export default router;
