import { NextFunction, Request, Response } from "express";
import {
  AcceptInvitationPayload,
  SendInvitationPayload,
} from "./invitations.schemas";
import { invitationsService } from "./invitations.service";
import { OrganizationIdParams } from "../organizations/organizations.schemas";
import { AuthenticatedRequest } from "../../middleware/authenticate";

export class InvitationsController {
  send = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, role } = req.validated!.body as SendInvitationPayload;
      const { orgId: organizationId } = req.validated!
        .params as OrganizationIdParams;

      const invitation = await invitationsService.send({
        email,
        role,
        organizationId,
      });
      res.status(201).json(invitation);
    } catch (error) {
      next(error);
    }
  };

  accept = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { token } = req.validated!.query as AcceptInvitationPayload;
      const userId = req.user!.userId;

      const invitation = await invitationsService.accept(token, userId);
      res.status(200).json(invitation);
    } catch (error) {
      next(error);
    }
  };

  pending = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { orgId: organizationId } = req.validated!
        .params as OrganizationIdParams;

      const invitations = await invitationsService.pending(organizationId);
      res.status(200).json(invitations);
    } catch (error) {
      next(error);
    }
  };
}

export const invitationsController = new InvitationsController();
