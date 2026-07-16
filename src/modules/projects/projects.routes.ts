import { Router } from "express";
import { projectsController } from "./projects.controller";
import { validate } from "../../middleware/validate";
import {
  createProjectSchema,
  projectDetailParamsSchema,
  updateProjectSchema,
} from "./projects.schemas";

const router = Router({ mergeParams: true });

router.post("/", validate(createProjectSchema), projectsController.create);

router.get("/", projectsController.list);

router.get(
  "/:projectId",
  validate(projectDetailParamsSchema, "params"),
  projectsController.getById,
);

router.patch(
  "/:projectId",
  validate(projectDetailParamsSchema, "params"),
  validate(updateProjectSchema),
  projectsController.update,
);

export default router;
