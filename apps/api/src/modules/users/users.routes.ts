import { Router } from "express";
import { authenticate } from "../../middleware/authenticate";
import { usersController } from "./users.controller";
import { updateUserSchema } from "./users.schemas";
import { validate } from "../../middleware/validate";

const router = Router();

router.get("/", authenticate, usersController.getUserProfile);

router.patch(
  "/",
  authenticate,
  validate(updateUserSchema),
  usersController.updateUserProfile,
);

export default router;
