import { Router } from "express";
import { validate } from "../middleware/validate";
import { searchController } from "./search.controller";
import { searchSchema } from "./search.schemas";

const router = Router();

/**
 * @swagger
 * /organizations/{orgSlug}/search:
 *   get:
 *     summary: Search across the organization
 *     tags: [Search]
 *     parameters:
 *       - in: path
 *         name: orgSlug
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         description: Search string
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *           default: 10
 *     responses:
 *       200:
 *         description: Search results returned
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Organization not found
 */
router.get("/", validate(searchSchema, "query"), searchController.search);

export default router;
