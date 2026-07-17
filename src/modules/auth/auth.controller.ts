import { NextFunction, Request, Response } from "express";
import { authService } from "./auth.service";
import { LoginBody, RefreshTokenBody, RegisterBody } from "./auth.schemas";

export class AuthController {
  register = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { name, email, password } = req.validated!.body as RegisterBody;

      const result = await authService.register({ name, email, password });
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  };

  login = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { email, password } = req.validated!.body as LoginBody;

      const result = await authService.login({ email, password });
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  refresh = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { refreshToken } = req.validated!.body as RefreshTokenBody;

      const tokens = await authService.refresh(refreshToken);
      res.json(tokens);
    } catch (error) {
      next(error);
    }
  };

  logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { refreshToken } = req.validated!.body as RefreshTokenBody;

      await authService.logout(refreshToken);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}

export const authController = new AuthController();
