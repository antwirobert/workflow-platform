import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../../middleware/authenticate";
import { organizationsService } from "./organizations.service";
import {
  CreateOrganizationPayload,
  UpdateOrganizationPayload,
  ListOrganizationsQueryInput,
  OrganizationIdParams,
} from "./organizations.schemas";

export class OrganizationsController {
  create = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { name, slug } = req.validated!.body as CreateOrganizationPayload;
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
      const { page, limit } = req.validated!
        .query as ListOrganizationsQueryInput;

      const organizations = await organizationsService.listForUser({
        page,
        limit,
        userId,
      });
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
      const organization = organizationsService.buildOrganizationResult(
        req.organization!,
        req.membership,
      );
      res.status(200).json(organization);
    } catch (error) {
      next(error);
    }
  };

  update = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const payload = req.validated!.body as UpdateOrganizationPayload;

      const organization = await organizationsService.update({
        organizationId: req.organization!.id,
        ...(payload as any),
      });
      res.status(200).json(organization);
    } catch (error) {
      next(error);
    }
  };

  delete = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      await organizationsService.delete(req.organization!.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };

  listMembers = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { page, limit } = req.validated!
        .query as ListOrganizationsQueryInput;

      const members = await organizationsService.listMembers({
        page,
        limit,
        organizationId: req.organization!.id,
      });
      res.status(200).json(members);
    } catch (error) {
      next(error);
    }
  };
}

export const organizationsController = new OrganizationsController();
