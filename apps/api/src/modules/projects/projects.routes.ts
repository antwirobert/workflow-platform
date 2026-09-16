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

/**
 * @swagger
 * /organizations/{orgSlug}/workspaces/{workspaceSlug}/projects:
 *   post:
 *     summary: Create a project in a workspace
 *     tags: [Projects]
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
 *             required: [name, slug]
 *             properties:
 *               name:
 *                 type: string
 *                 example: Mobile App
 *               slug:
 *                 type: string
 *                 example: mobile-app
 *               description:
 *                 type: string
 *                 example: App redesign initiative
 *     responses:
 *       201:
 *         description: Project created successfully
 *       403:
 *         description: Insufficient permissions
 */
router.post(
  "/",
  validate(createProjectSchema),
  requireRole("ADMIN"),
  projectsController.create,
);

/**
 * @swagger
 * /organizations/{orgSlug}/workspaces/{workspaceSlug}/projects:
 *   get:
 *     summary: List projects in a workspace
 *     tags: [Projects]
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
 *         description: Projects returned
 */
router.get(
  "/",
  validate(listProjectsQuerySchema, "query"),
  projectsController.list,
);

/**
 * @swagger
 * /organizations/{orgSlug}/workspaces/{workspaceSlug}/projects/{projectSlug}:
 *   get:
 *     summary: Get project details
 *     tags: [Projects]
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
 *       - in: path
 *         name: projectSlug
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Project returned
 *       404:
 *         description: Project not found
 */
router.get(
  "/:projectSlug",
  validate(projectDetailParamsSchema, "params"),
  assertProjectToWorkspace,
  projectsController.getById,
);

/**
 * @swagger
 * /organizations/{orgSlug}/workspaces/{workspaceSlug}/projects/{projectSlug}/assignees:
 *   get:
 *     summary: List project assignees
 *     tags: [Projects]
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
 *       - in: path
 *         name: projectSlug
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Assignees returned
 */
router.get(
  "/:projectSlug/assignees",
  validate(projectDetailParamsSchema, "params"),
  validate(listProjectsQuerySchema, "query"),
  assertProjectToWorkspace,
  projectsController.listProjectAsssignees,
);

/**
 * @swagger
 * /organizations/{orgSlug}/workspaces/{workspaceSlug}/projects/{projectSlug}:
 *   patch:
 *     summary: Update a project
 *     tags: [Projects]
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
 *       - in: path
 *         name: projectSlug
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
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Project updated successfully
 *       403:
 *         description: Insufficient permissions
 */
router.patch(
  "/:projectSlug",
  validate(projectDetailParamsSchema, "params"),
  assertProjectToWorkspace,
  validate(updateProjectSchema),
  requireRole("ADMIN"),
  projectsController.update,
);

/**
 * @swagger
 * /organizations/{orgSlug}/workspaces/{workspaceSlug}/projects/{projectSlug}:
 *   delete:
 *     summary: Delete a project
 *     tags: [Projects]
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
 *       - in: path
 *         name: projectSlug
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Project deleted successfully
 *       403:
 *         description: Insufficient permissions
 */
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
