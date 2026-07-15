import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../../middleware/authenticate";
import { organizationsService } from "./organizations.service";
import { CreateOrganizationBody } from "./organizations.schemas";

export class OrganizationsController {
  create = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { name, slug } = req.validated!.body as CreateOrganizationBody;
      const userId = req.user!.userId;

      const organization = await organizationsService.create({
        name,
        slug,
        userId,
      });
      res.status(201).json(organization);
    } catch (error) {
      next(error);
    }
  };
}

export const organizationsController = new OrganizationsController();
