import { Router } from "express";
import { validate } from "../../middleware/validate";
import { workspacesController } from "./workspaces.controller";
import {
  workspaceCreateSchema,
  workspaceIdParamsSchema,
  workspaceUpdateSchema,
} from "./workspaces.schemas";

const router = Router({ mergeParams: true });

router.post("/", validate(workspaceCreateSchema), workspacesController.create);

router.get("/", workspacesController.list);

router.get(
  "/:workspaceId",
  validate(workspaceIdParamsSchema, "params"),
  workspacesController.getById,
);

router.patch(
  "/:workspaceId",
  validate(workspaceIdParamsSchema, "params"),
  validate(workspaceUpdateSchema),
  workspacesController.update,
);

export default router;
