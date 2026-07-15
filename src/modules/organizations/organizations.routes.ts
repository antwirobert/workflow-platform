import { Router } from "express";
import { organizationsController } from "./organizations.controller";
import { authenticate } from "../../middleware/authenticate";
import { validate } from "../../middleware/validate";
import { createOrganizationSchema } from "./organizations.schemas";

const router = Router();

router.post(
  "/",
  authenticate,
  validate(createOrganizationSchema),
  organizationsController.create,
);

export default router;
