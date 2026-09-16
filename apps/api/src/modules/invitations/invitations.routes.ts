import { Router } from "express";
import { invitationsController } from "./invitations.controller";
import { validate } from "../../middleware/validate";
import {
  acceptInvitationSchema,
  sendInvitationSchema,
} from "./invitations.schemas";
import { authenticate } from "../../middleware/authenticate";
import { requireRole } from "../../middleware/requireRole";

const router = Router();

/**
 * @swagger
 * /invitations:
 *   post:
 *     summary: Send an invitation to join an organization
 *     tags: [Invitations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, orgId]
 *             properties:
 *               email:
 *                 type: string
 *                 example: jane@example.com
 *               orgId:
 *                 type: string
 *                 format: uuid
 *                 example: 1d2c0d87-8d2f-4b3c-9d54-e0b2365f0a0c
 *     responses:
 *       201:
 *         description: Invitation created successfully
 *       403:
 *         description: Unauthorized or insufficient role
 */
router.post(
  "/",
  validate(sendInvitationSchema),
  requireRole("ADMIN"),
  invitationsController.send,
);

/**
 * @swagger
 * /invitations/accept:
 *   get:
 *     summary: Accept an invitation
 *     tags: [Invitations]
 *     parameters:
 *       - in: query
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Invitation token
 *     responses:
 *       200:
 *         description: Invitation accepted successfully
 *       400:
 *         description: Invalid or expired token
 *       401:
 *         description: Unauthorized
 */
router.get(
  "/accept",
  authenticate,
  validate(acceptInvitationSchema, "query"),
  invitationsController.accept,
);

/**
 * @swagger
 * /invitations:
 *   get:
 *     summary: List pending invitations for the organization
 *     tags: [Invitations]
 *     responses:
 *       200:
 *         description: Pending invitations returned
 *       403:
 *         description: Insufficient permissions
 */
router.get("/", requireRole("ADMIN"), invitationsController.pending);

export default router;
