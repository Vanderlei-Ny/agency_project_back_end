import { FastifyInstance } from "fastify";
import {
  loginController,
  registerClientController,
} from "../controllers/auth.controller";
import { createAgencyController } from "../controllers/agencies.controller";

export async function authRoutes(app: FastifyInstance) {
  app.post("/auth/register-client", {
    schema: {
      body: {
        type: "object",
        required: ["name", "email", "password"],
        properties: {
          name: { type: "string" },
          email: { type: "string" },
          password: { type: "string" },
        },
      },
    },
  }, registerClientController);

  app.post("/auth/register-agency", {
    schema: {
      body: {
        type: "object",
        required: ["name", "email", "password"],
        properties: {
          name: { type: "string" },
          email: { type: "string" },
          password: { type: "string" },
          agencyName: { type: "string" },
        },
      },
    },
  }, createAgencyController);

  app.post("/auth/login", {
    schema: {
      body: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: { type: "string" },
          password: { type: "string" },
        },
      },
    },
  }, loginController);
}