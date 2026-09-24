import express from "express";
import cors from "cors";
import healthRouter from "./modules/health/health.routes";
import authRouter from "./modules/auth/auth.routes";
import { errorHandler } from "./middleware/errorHandler";
import organizationsRouter from "./modules/organizations/organizations.routes";
import invitationsRouter from "./modules/invitations/invitations.routes";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./docs/swagger";
import { authRateLimiter, generalRateLimiter } from "./middleware/rateLimiter";
import { requestLogger } from "./middleware/requestLogger";

const app = express();

// Middleware
app.use(express.json());
app.use(requestLogger);

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(generalRateLimiter);

// Routes
app.use("/api-docs", swaggerUi.serve);
app.get("/api-docs", swaggerUi.setup(swaggerSpec));
app.use("/api/health", healthRouter);
app.use("/api/auth", authRateLimiter, authRouter);
app.use("/api/organizations", organizationsRouter);
app.use("/api/invitations", invitationsRouter);

// Global error handler
app.use(errorHandler);

export default app;
