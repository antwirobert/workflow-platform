import { Router } from "express";
import { validate } from "../../middleware/validate";
import {
  commentDetailParamsSchema,
  commentTaskParamsSchema,
  createCommentSchema,
} from "./comments.schemas";
import { commentsController } from "./comments.controller";

const router = Router({ mergeParams: true });

router.post("/", validate(createCommentSchema), commentsController.create);

router.get("/", commentsController.list);

router.delete(
  "/:commentId",
  validate(commentDetailParamsSchema, "params"),
  commentsController.delete,
);

export default router;
