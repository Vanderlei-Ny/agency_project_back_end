import Fastify, { FastifyInstance } from "fastify";
import cors from "@fastify/cors";
import jwt from "@fastify/jwt";
import multipart from "@fastify/multipart";
import swagger from "@fastify/swagger";
import swaggerUI from "@fastify/swagger-ui";
import { ensureSuperadmin } from "./core/use-cases/ensure-superadmin";
import { registerRoutes } from "./http/routes";

export function buildApp(): FastifyInstance {
  const app = Fastify({ logger: true });

  app.register(cors, {
    origin: true,
    credentials: true,
  });

  app.register(jwt, {
    secret: process.env.JWT_SECRET ?? "dev-secret-change-me",
  });

  app.register(multipart, {
    limits: {
      fileSize: 20 * 1024 * 1024,
    },
  });

  app.register(swagger, {
    openapi: {
      info: {
        title: "Documentação Agency Project",
        description: "API do projeto da Unisagrado para gerenciamento",
        version: "1.0.0",
      },
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
  });

  app.register(swaggerUI, {
    routePrefix: "/docs",
  });

  app.addHook("onReady", async () => {
    await ensureSuperadmin();
  });

  app.register(registerRoutes);

  return app;
}