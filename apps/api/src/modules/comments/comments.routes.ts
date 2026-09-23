import { Router } from "express";
import { validate } from "../../middleware/validate";
import {
  commentDetailParamsSchema,
  createCommentSchema,
} from "./comments.schemas";
import { commentsController } from "./comments.controller";

const router = Router({ mergeParams: true });

/**
 * @swagger
 * /organizations/{orgSlug}/workspaces/{workspaceSlug}/projects/{projectSlug}/tasks/{taskId}/comments:
 *   post:
 *     summary: Add a comment to a task
 *     tags: [Comments]
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
 *             required: [content]
 *             properties:
 *               content:
 *                 type: string
 *                 example: Needs review before launch
 *     responses:
 *       201:
 *         description: Comment created successfully
 */
router.post("/", validate(createCommentSchema), commentsController.create);

/**
 * @swagger
 * /organizations/{orgSlug}/workspaces/{workspaceSlug}/projects/{projectSlug}/tasks/{taskId}/comments:
 *   get:
 *     summary: List comments on a task
 *     tags: [Comments]
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
 *         description: Comments returned
 */
router.get("/", commentsController.list);

/**
 * @swagger
 * /organizations/{orgSlug}/workspaces/{workspaceSlug}/projects/{projectSlug}/tasks/{taskId}/comments/{commentId}:
 *   delete:
 *     summary: Delete a comment
 *     tags: [Comments]
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
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       204:
 *         description: Comment deleted successfully
 */
router.delete(
  "/:commentId",
  validate(commentDetailParamsSchema, "params"),
  commentsController.delete,
);

export default router;
