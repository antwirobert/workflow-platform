import { Request, Response } from "express";

export class HealthController {
  healthCheck = (req: Request, res: Response) => {
    res.status(200).json({
      status: "ok",
      timestamp: new Date().toISOString(),
    });
  };
}

export const healthController = new HealthController();
