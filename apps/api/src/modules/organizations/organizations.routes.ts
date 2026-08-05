import { Router } from "express";
import { organizationsController } from "./organizations.controller";
import { authenticate } from "../../middleware/authenticate";
import { validate } from "../../middleware/validate";
import {
  createOrganizationSchema,
  listOrganizationsQuerySchema,
  orgIdParamSchema,
} from "./organizations.schemas";
import { updateOrganizationSchema } from "./organizations.schemas";
import { requireRole } from "../../middleware/requireRole";
import workspacesRouter from "../workspaces/workspaces.routes";
import searchRouter from "../../search/search.routes";
import invitationsRouter from "../invitations/invitations.routes";
import { assertOrgMembership } from "../../middleware/guards";

const router = Router();

router.post(
  "/",
  authenticate,
  validate(createOrganizationSchema),
  organizationsController.create,
);

router.get(
  "/",
  authenticate,
  validate(listOrganizationsQuerySchema, "query"),
  organizationsController.list,
);

router.get(
  "/:orgId",
  authenticate,
  validate(orgIdParamSchema, "params"),
  organizationsController.getById,
);

router.patch(
  "/:orgId",
  authenticate,
  validate(orgIdParamSchema, "params"),
  validate(updateOrganizationSchema),
  assertOrgMembership,
  requireRole("ADMIN"),
  organizationsController.update,
);

router.delete(
  "/:orgId",
  authenticate,
  validate(orgIdParamSchema, "params"),
  assertOrgMembership,
  requireRole("OWNER"),
  organizationsController.delete,
);

// Mount nested workspaces router with strict tenancy validation middleware
router.use(
  "/:orgId/workspaces",
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

router.use(
  "/:orgId/invitations",
  validate(orgIdParamSchema, "params"),
  authenticate,
  assertOrgMembership,
  invitationsRouter,
);

export default router;
