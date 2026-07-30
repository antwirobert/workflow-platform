import { Router } from "express";
import { authController } from "./auth.controller";
import { validate } from "../../middleware/validate";
import {
  loginSchema,
  refreshTokenSchema,
  registerSchema,
} from "./auth.schemas";
import { authenticate } from "../../middleware/authenticate";

const router = Router();

router.post("/register", validate(registerSchema), authController.register);

router.post("/login", validate(loginSchema), authController.login);

router.post("/refresh", validate(refreshTokenSchema), authController.refresh);

router.post("/logout", validate(refreshTokenSchema), authController.logout);

router.get("/me", authenticate, authController.me);

export default router;
