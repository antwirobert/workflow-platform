import express from "express";
import healthRouter from "./modules/health/health.routes";
import authRouter from "./modules/auth/auth.routes";
import { errorHandler } from "./middleware/errorHandler";
const app = express();

// Middleware
app.use(express.json());

// Routes
app.use("api/health", healthRouter);
app.use("/api/auth", authRouter);

app.use(errorHandler);

export default app;
