import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../../middleware/authenticate";
import { organizationsService } from "./organizations.service";
import {
  CreateOrganizationBody,
  OrgIdParamInput,
} from "./organizations.schemas";

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

  list = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const userId = req.user!.userId;

      const organizations = await organizationsService.listForUser(userId);
      res.status(200).json(organizations);
    } catch (error) {
      next(error);
    }
  };

  getById = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { orgId } = req.validated?.params as OrgIdParamInput;
      const userId = req.user!.userId;

      const organization = await organizationsService.getById(orgId, userId);
      res.status(200).json(organization);
    } catch (error) {
      next(error);
    }
  };
}

export const organizationsController = new OrganizationsController();
