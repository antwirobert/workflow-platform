import { Router } from "express";
import { upload } from "./multer.config";
import { filesController } from "./files.controller";
import { validate } from "../../middleware/validate";
import { fileTaskParamsSchema } from "./files.schemas";

const router = Router({ mergeParams: true });

router.post("/", upload.single("file"), filesController.upload);

router.get("/", filesController.list);

router.delete(
  "/:fileId",
  validate(fileTaskParamsSchema, "params"),
  filesController.delete,
);

export default router;
