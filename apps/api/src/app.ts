import express from "express";
import cors from "cors";
import healthRouter from "./modules/health/health.routes";
import authRouter from "./modules/auth/auth.routes";
import { errorHandler } from "./middleware/errorHandler";
import organizationsRouter from "./modules/organizations/organizations.routes";
import invitationsRouter from "./modules/invitations/invitations.routes";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./docs/swagger";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// Middleware
app.use(express.json());

// Routes
app.use("/api/health", healthRouter);
app.use("/api/auth", authRouter);
app.use("/api/organizations", organizationsRouter);
app.use("/api/invitations", invitationsRouter);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Global error handler
app.use(errorHandler);

export default app;
