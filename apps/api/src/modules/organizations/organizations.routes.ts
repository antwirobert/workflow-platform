import { Router } from "express";
import { organizationsController } from "./organizations.controller";
import { authenticate } from "../../middleware/authenticate";
import { validate } from "../../middleware/validate";
import {
  createOrganizationSchema,
  dashboardQuerySchema,
  listOrganizationsQuerySchema,
  orgSlugParamSchema,
} from "./organizations.schemas";
import { updateOrganizationSchema } from "./organizations.schemas";
import { requireRole } from "../../middleware/requireRole";
import workspacesRouter from "../workspaces/workspaces.routes";
import searchRouter from "../../search/search.routes";
import invitationsRouter from "../invitations/invitations.routes";
import { assertOrgMembership } from "../../middleware/guards";
import { listTasksQuerySchema } from "../tasks/tasks.schemas";

const router = Router();

/**
 * @swagger
 * /organizations:
 *   post:
 *     summary: Create an organization
 *     tags: [Organizations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, slug]
 *             properties:
 *               name:
 *                 type: string
 *                 example: Acme Corp
 *               slug:
 *                 type: string
 *                 example: acme
 *     responses:
 *       201:
 *         description: Organization created successfully
 *       401:
 *         description: Unauthorized
 */
router.post(
  "/",
  authenticate,
  validate(createOrganizationSchema),
  organizationsController.create,
);

/**
 * @swagger
 * /organizations:
 *   get:
 *     summary: List organizations for the authenticated user
 *     tags: [Organizations]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Organizations returned
 *       401:
 *         description: Unauthorized
 */
router.get(
  "/",
  authenticate,
  validate(listOrganizationsQuerySchema, "query"),
  organizationsController.list,
);

/**
 * @swagger
 * /organizations/{orgSlug}:
 *   get:
 *     summary: Get organization details
 *     tags: [Organizations]
 *     parameters:
 *       - in: path
 *         name: orgSlug
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Organization detail returned
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Organization not found
 */
router.get(
  "/:orgSlug",
  authenticate,
  validate(orgSlugParamSchema, "params"),
  assertOrgMembership,
  organizationsController.getById,
);

/**
 * @swagger
 * /organizations/{orgSlug}/members:
 *   get:
 *     summary: List organization members
 *     tags: [Organizations]
 *     parameters:
 *       - in: path
 *         name: orgSlug
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Members returned
 *       401:
 *         description: Unauthorized
 */
router.get(
  "/:orgSlug/members",
  authenticate,
  validate(orgSlugParamSchema, "params"),
  validate(listOrganizationsQuerySchema, "query"),
  assertOrgMembership,
  organizationsController.listMembers,
);

/**
 * @swagger
 * /organizations/{orgSlug}/dashboard:
 *   get:
 *     summary: Get organization dashboard data
 *     tags: [Organizations]
 *     parameters:
 *       - in: path
 *         name: orgSlug
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *     responses:
 *       200:
 *         description: Dashboard data returned
 *       401:
 *         description: Unauthorized
 */
router.get(
  "/:orgSlug/dashboard",
  authenticate,
  validate(orgSlugParamSchema, "params"),
  validate(dashboardQuerySchema, "query"),
  assertOrgMembership,
  organizationsController.getDashboard,
);

/**
 * @swagger
 * /organizations/{orgSlug}/tasks:
 *   get:
 *     summary: List tasks for the current user in the organization
 *     tags: [Organizations]
 *     parameters:
 *       - in: path
 *         name: orgSlug
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User tasks returned
 *       401:
 *         description: Unauthorized
 */
router.get(
  "/:orgSlug/tasks",
  authenticate,
  validate(orgSlugParamSchema, "params"),
  validate(listTasksQuerySchema, "query"),
  assertOrgMembership,
  organizationsController.listUserTasks,
);

/**
 * @swagger
 * /organizations/{orgSlug}:
 *   patch:
 *     summary: Update organization settings
 *     tags: [Organizations]
 *     parameters:
 *       - in: path
 *         name: orgSlug
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               slug:
 *                 type: string
 *     responses:
 *       200:
 *         description: Organization updated successfully
 *       403:
 *         description: Insufficient permissions
 */
router.patch(
  "/:orgSlug",
  authenticate,
  validate(orgSlugParamSchema, "params"),
  validate(updateOrganizationSchema),
  assertOrgMembership,
  requireRole("ADMIN"),
  organizationsController.update,
);

/**
 * @swagger
 * /organizations/{orgSlug}:
 *   delete:
 *     summary: Delete an organization
 *     tags: [Organizations]
 *     parameters:
 *       - in: path
 *         name: orgSlug
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Organization deleted successfully
 *       403:
 *         description: Forbidden
 */
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
