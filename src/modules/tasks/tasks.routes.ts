import { Router } from "express";
import { tasksController } from "./tasks.controller";
import { validate } from "../../middleware/validate";
import {
  createTaskSchema,
  taskDetailParamsSchema,
  updateTaskSchema,
} from "./tasks.schemas";

const router = Router({ mergeParams: true });

router.post("/", validate(createTaskSchema), tasksController.create);

router.get("/", tasksController.list);

router.get(
  "/:taskId",
  validate(taskDetailParamsSchema, "params"),
  tasksController.getById,
);

router.patch(
  "/:taskId",
  validate(taskDetailParamsSchema, "params"),
  validate(updateTaskSchema),
  tasksController.update,
);

router.delete(
  "/:taskId",
  validate(taskDetailParamsSchema, "params"),
  tasksController.delete,
);

export default router;
