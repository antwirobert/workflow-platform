import { Router } from "express";
import { projectsController } from "./projects.controller";
import { validate } from "../../middleware/validate";
import { createProjectSchema } from "./projects.schemas";

const router = Router({ mergeParams: true });

router.post("/", validate(createProjectSchema), projectsController.create);

export default router;
