import { Router } from "express";
import { invitationsController } from "./invitations.controller";
import { validate } from "../../middleware/validate";
import {
  acceptInvitationSchema,
  sendInvitationSchema,
} from "./invitations.schemas";
import { authenticate } from "../../middleware/authenticate";

const router = Router();

router.post("/", validate(sendInvitationSchema), invitationsController.send);

router.get(
  "/accept",
  authenticate,
  validate(acceptInvitationSchema, "query"),
  invitationsController.accept,
);

router.get("/", invitationsController.pending);

export default router;
