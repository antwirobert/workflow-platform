import { Router } from "express";
import { tasksController } from "./tasks.controller";
import { validate } from "../../middleware/validate";
import {
  createTaskSchema,
  listTasksQuerySchema,
  taskDetailParamsSchema,
  updateTaskSchema,
} from "./tasks.schemas";
import commentsRouter from "../comments/comments.routes";
import filesRouter from "../files/files.routes";
import { assertTaskToProject } from "../../middleware/guards";
import { requireRole } from "../../middleware/requireRole";

const router = Router({ mergeParams: true });

/**
 * @swagger
 * /organizations/{orgSlug}/workspaces/{workspaceSlug}/projects/{projectSlug}/tasks:
 *   post:
 *     summary: Create a task in a project
 *     tags: [Tasks]
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
 *             required: [title]
 *             properties:
 *               title:
 *                 type: string
 *                 example: Add task filters
 *               description:
 *                 type: string
 *                 example: Add filtering by status and assignee
 *               status:
 *                 type: string
 *                 enum: [TODO, IN_PROGRESS, REVIEW, DONE]
 *               priority:
 *                 type: string
 *                 enum: [LOW, MEDIUM, HIGH, URGENT]
 *               assigneeId:
 *                 type: string
 *                 format: uuid
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *               labels:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Task created successfully
 *       403:
 *         description: Insufficient permissions
 */
router.post("/", validate(createTaskSchema), tasksController.create);

/**
 * @swagger
 * /organizations/{orgSlug}/workspaces/{workspaceSlug}/projects/{projectSlug}/tasks:
 *   get:
 *     summary: List tasks in a project
 *     tags: [Tasks]
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
 *         description: Tasks returned
 */
router.get("/", validate(listTasksQuerySchema, "query"), tasksController.list);

/**
 * @swagger
 * /organizations/{orgSlug}/workspaces/{workspaceSlug}/projects/{projectSlug}/tasks/{taskId}:
 *   get:
 *     summary: Get task details
 *     tags: [Tasks]
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
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Task returned
 *       404:
 *         description: Task not found
 */
router.get(
  "/:taskId",
  validate(taskDetailParamsSchema, "params"),
  tasksController.getById,
);

/**
 * @swagger
 * /organizations/{orgSlug}/workspaces/{workspaceSlug}/projects/{projectSlug}/tasks/{taskId}:
 *   patch:
 *     summary: Update a task
 *     tags: [Tasks]
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
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *               priority:
 *                 type: string
 *               assigneeId:
 *                 type: string
 *                 nullable: true
 *               dueDate:
 *                 type: string
 *                 nullable: true
 *               labels:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Task updated successfully
 */
router.patch(
  "/:taskId",
  validate(taskDetailParamsSchema, "params"),
  validate(updateTaskSchema),
  tasksController.update,
);

/**
 * @swagger
 * /organizations/{orgSlug}/workspaces/{workspaceSlug}/projects/{projectSlug}/tasks/{taskId}:
 *   delete:
 *     summary: Delete a task
 *     tags: [Tasks]
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
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       204:
 *         description: Task deleted successfully
 *       403:
 *         description: Insufficient permissions
 */
router.delete(
  "/:taskId",
  validate(taskDetailParamsSchema, "params"),
  requireRole("ADMIN"),
  tasksController.delete,
);

router.use(
  "/:taskId/comments",
  validate(taskDetailParamsSchema, "params"),
  assertTaskToProject,
  commentsRouter,
);

router.use(
  "/:taskId/files",
  validate(taskDetailParamsSchema, "params"),
  assertTaskToProject,
  filesRouter,
);

export default router;
