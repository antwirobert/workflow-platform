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

/**
 * @swagger
 * /organizations/{orgSlug}/workspaces:
 *   post:
 *     summary: Create a workspace in an organization
 *     tags: [Workspaces]
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
 *             required: [name, slug]
 *             properties:
 *               name:
 *                 type: string
 *                 example: Product Team
 *               slug:
 *                 type: string
 *                 example: product-team
 *     responses:
 *       201:
 *         description: Workspace created successfully
 *       403:
 *         description: Insufficient permissions
 */
router.post(
  "/",
  validate(workspaceCreateSchema),
  requireRole("ADMIN"),
  workspacesController.create,
);

/**
 * @swagger
 * /organizations/{orgSlug}/workspaces:
 *   get:
 *     summary: List workspaces in an organization
 *     tags: [Workspaces]
 *     parameters:
 *       - in: path
 *         name: orgSlug
 *         required: true
 *         schema:
 *           type: string
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
 *     responses:
 *       200:
 *         description: Workspaces returned
 */
router.get(
  "/",
  validate(listWorkspacesQuerySchema, "query"),
  workspacesController.list,
);

/**
 * @swagger
 * /organizations/{orgSlug}/workspaces/{workspaceSlug}:
 *   get:
 *     summary: Get workspace details
 *     tags: [Workspaces]
 *     parameters:
 *       - in: path
 *         name: orgSlug
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: workspaceSlug
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Workspace returned
 *       404:
 *         description: Workspace not found
 */
router.get(
  "/:workspaceSlug",
  validate(workspaceDetailParamsSchema, "params"),
  assertWorkspaceToOrg,
  workspacesController.getById,
);

/**
 * @swagger
 * /organizations/{orgSlug}/workspaces/{workspaceSlug}/tasks:
 *   get:
 *     summary: List tasks for a workspace
 *     tags: [Workspaces]
 *     parameters:
 *       - in: path
 *         name: orgSlug
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: workspaceSlug
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Workspace tasks returned
 */
router.get(
  "/:workspaceSlug/tasks",
  validate(workspaceDetailParamsSchema, "params"),
  validate(listWorkspacesQuerySchema, "query"),
  assertWorkspaceToOrg,
  workspacesController.listWorkspaceTasks,
);

/**
 * @swagger
 * /organizations/{orgSlug}/workspaces/{workspaceSlug}/members:
 *   get:
 *     summary: List workspace members
 *     tags: [Workspaces]
 *     parameters:
 *       - in: path
 *         name: orgSlug
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: workspaceSlug
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Workspace members returned
 */
router.get(
  "/:workspaceSlug/members",
  validate(workspaceDetailParamsSchema, "params"),
  validate(listWorkspacesQuerySchema, "query"),
  assertWorkspaceToOrg,
  workspacesController.listWorkspaceMembers,
);

/**
 * @swagger
 * /organizations/{orgSlug}/workspaces/{workspaceSlug}:
 *   patch:
 *     summary: Update a workspace
 *     tags: [Workspaces]
 *     parameters:
 *       - in: path
 *         name: orgSlug
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: workspaceSlug
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
 *         description: Workspace updated successfully
 *       403:
 *         description: Insufficient permissions
 */
router.patch(
  "/:workspaceSlug",
  validate(workspaceDetailParamsSchema, "params"),
  assertWorkspaceToOrg,
  validate(workspaceUpdateSchema),
  requireRole("ADMIN"),
  workspacesController.update,
);

/**
 * @swagger
 * /organizations/{orgSlug}/workspaces/{workspaceSlug}:
 *   delete:
 *     summary: Delete a workspace
 *     tags: [Workspaces]
 *     parameters:
 *       - in: path
 *         name: orgSlug
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: workspaceSlug
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Workspace deleted successfully
 *       403:
 *         description: Insufficient permissions
 */
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
