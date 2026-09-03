import { Router } from "express";
import { organizationsController } from "./organizations.controller";
import { authenticate } from "../../middleware/authenticate";
import { validate } from "../../middleware/validate";
import {
  createOrganizationSchema,
  listOrganizationsQuerySchema,
  orgSlugParamSchema,
} from "./organizations.schemas";
import { updateOrganizationSchema } from "./organizations.schemas";
import { requireRole } from "../../middleware/requireRole";
import workspacesRouter from "../workspaces/workspaces.routes";
import searchRouter from "../../search/search.routes";
import invitationsRouter from "../invitations/invitations.routes";
import { assertOrgMembership } from "../../middleware/guards";
import { listProjectsQuerySchema } from "../projects/projects.schemas";

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
  "/:orgSlug",
  authenticate,
  validate(orgSlugParamSchema, "params"),
  assertOrgMembership,
  organizationsController.getById,
);

router.get(
  "/:orgSlug/members",
  authenticate,
  validate(orgSlugParamSchema, "params"),
  validate(listOrganizationsQuerySchema, "query"),
  assertOrgMembership,
  organizationsController.listMembers,
);

router.get(
  "/:orgSlug/projects",
  authenticate,
  validate(orgSlugParamSchema, "params"),
  validate(listProjectsQuerySchema, "query"),
  assertOrgMembership,
  organizationsController.listProjects,
);

router.get(
  "/:orgSlug/dashboard",
  authenticate,
  validate(orgSlugParamSchema, "params"),
  assertOrgMembership,
  organizationsController.getDashboard,
);

router.patch(
  "/:orgSlug",
  authenticate,
  validate(orgSlugParamSchema, "params"),
  validate(updateOrganizationSchema),
  assertOrgMembership,
  requireRole("ADMIN"),
  organizationsController.update,
);

router.delete(
  "/:orgSlug",
  authenticate,
  validate(orgSlugParamSchema, "params"),
  assertOrgMembership,
  requireRole("OWNER"),
  organizationsController.delete,
);

// Mount nested workspaces router with strict tenancy validation middleware
router.use(
  "/:orgSlug/workspaces",
  validate(orgSlugParamSchema, "params"),
  authenticate,
  assertOrgMembership,
  workspacesRouter,
);

router.use(
  "/:orgSlug/search",
  validate(orgSlugParamSchema, "params"),
  authenticate,
  assertOrgMembership,
  searchRouter,
);

router.use(
  "/:orgSlug/invitations",
  validate(orgSlugParamSchema, "params"),
  authenticate,
  assertOrgMembership,
  invitationsRouter,
);

export default router;
