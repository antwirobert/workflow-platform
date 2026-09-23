import { NextFunction, Request, Response } from "express";
import {
  AcceptInvitationPayload,
  SendInvitationPayload,
} from "./invitations.schemas";
import { invitationsService } from "./invitations.service";
import { AuthenticatedRequest } from "../../middleware/authenticate";

export class InvitationsController {
  send = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { email, role } = req.validated!.body as SendInvitationPayload;

      const invitation = await invitationsService.send({
        email,
        role,
        organizationId: req.organization!.id,
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

  pending = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const invitations = await invitationsService.pending(
        req.organization!.id,
      );
      res.status(200).json(invitations);
    } catch (error) {
      next(error);
    }
  };
}

export const invitationsController = new InvitationsController();
