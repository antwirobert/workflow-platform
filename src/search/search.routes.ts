import { Router } from "express";
import { validate } from "../middleware/validate";
import { searchController } from "./search.controller";
import { searchSchema } from "./search.schemas";

const router = Router();

router.get("/", validate(searchSchema, "query"), searchController.search);

export default router;
