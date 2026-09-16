import { Router } from "express";
import { upload } from "./multer.config";
import { filesController } from "./files.controller";
import { validate } from "../../middleware/validate";
import { fileTaskParamsSchema } from "./files.schemas";

const router = Router({ mergeParams: true });

/**
 * @swagger
 * /organizations/{orgSlug}/workspaces/{workspaceSlug}/projects/{projectSlug}/tasks/{taskId}/files:
 *   post:
 *     summary: Upload a file for a task
 *     tags: [Files]
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
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [file]
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: File uploaded successfully
 */
router.post("/", upload.single("file"), filesController.upload);

/**
 * @swagger
 * /organizations/{orgSlug}/workspaces/{workspaceSlug}/projects/{projectSlug}/tasks/{taskId}/files:
 *   get:
 *     summary: List files attached to a task
 *     tags: [Files]
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
 *         description: Files returned
 */
router.get("/", filesController.list);

/**
 * @swagger
 * /organizations/{orgSlug}/workspaces/{workspaceSlug}/projects/{projectSlug}/tasks/{taskId}/files/{fileId}:
 *   get:
 *     summary: Get file metadata or contents
 *     tags: [Files]
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
 *         name: fileId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: File returned
 */
router.get(
  "/:fileId",
  validate(fileTaskParamsSchema, "params"),
  filesController.getById,
);

/**
 * @swagger
 * /organizations/{orgSlug}/workspaces/{workspaceSlug}/projects/{projectSlug}/tasks/{taskId}/files/{fileId}:
 *   delete:
 *     summary: Delete a task file
 *     tags: [Files]
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
 *         name: fileId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       204:
 *         description: File deleted successfully
 */
router.delete(
  "/:fileId",
  validate(fileTaskParamsSchema, "params"),
  filesController.delete,
);

export default router;
