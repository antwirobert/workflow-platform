import express from "express";
import { Response } from "express";
import healthRouter from "./modules/health/health.routes";
const app = express();

app.use(express.json());

app.use("/health", healthRouter);
app.get("/", (_, res: Response) => res.send("API is running..."));

export default app;
