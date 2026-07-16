import { Router } from "express";
import { authenticate } from "../../middleware/authenticate";
import { validate } from "../../middleware/validate";
import { workspacesController } from "./workspaces.controller";
import {
  orgIdParamSchema,
  workspaceCreateSchema,
  workspaceDetailParamsSchema,
  workspaceUpdateSchema,
} from "./workspaces.schemas";

const router = Router({ mergeParams: true });

router.post(
  "/",
  authenticate,
  validate(orgIdParamSchema, "params"),
  validate(workspaceCreateSchema),
  workspacesController.create,
);

router.get(
  "/",
  authenticate,
  validate(orgIdParamSchema, "params"),
  workspacesController.list,
);

router.get(
  "/:workspaceId",
  authenticate,
  validate(workspaceDetailParamsSchema, "params"),
  workspacesController.getById,
);

router.patch(
  "/:workspaceId",
  authenticate,
  validate(workspaceDetailParamsSchema, "params"),
  validate(workspaceUpdateSchema),
  workspacesController.update,
);

export default router;
