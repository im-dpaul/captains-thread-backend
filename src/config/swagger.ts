import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

import { env } from "./env.js";

const swaggerOptions: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.3",

    info: {
      title: "Captain's Thread API",
      version: "1.0.0",
      description: "REST API documentation for Captain's Thread e-commerce platform.",
    },

    servers: [
      {
        url: `http://localhost:${env.port}`,
        description: "Local development server",
      },
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
  },

  apis: ["./src/docs/**/*.yaml"],
};

const swaggerDocument = swaggerJsdoc(swaggerOptions);

export { swaggerDocument, swaggerUi };
