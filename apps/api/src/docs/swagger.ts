import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "PM API",
      version: "1.0.0",
      description: "Production-grade multi-tenant project management API",
    },
    servers: [
      { url: "http://localhost:8080/api", description: "Development server" },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ["./src/**/*.routes.ts"],
};

export const swaggerSpec = swaggerJsdoc(options);
