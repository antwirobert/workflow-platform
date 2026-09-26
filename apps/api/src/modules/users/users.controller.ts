import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../../middleware/authenticate";
import { usersService } from "./users.service";
import { UpdateUserBody } from "./users.schemas";

export class UsersController {
  getUserProfile = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const userId = req.user!.userId;

      const user = await usersService.getUserProfile(userId);
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  };

  updateUserProfile = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { name, email } = req.validated!.body as UpdateUserBody;
      const userId = req.user!.userId;

      const user = await usersService.updateUserProfile({
        name,
        email,
        userId,
      });
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  };
}

export const usersController = new UsersController();
