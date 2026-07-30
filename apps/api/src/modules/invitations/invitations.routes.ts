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

router.post(
  "/",
  validate(sendInvitationSchema),
  requireRole("ADMIN"),
  invitationsController.send,
);

router.get(
  "/accept",
  authenticate,
  validate(acceptInvitationSchema, "query"),
  invitationsController.accept,
);

router.get("/", requireRole("ADMIN"), invitationsController.pending);

export default router;
