import Fastify, { FastifyInstance } from "fastify";
import cors from "@fastify/cors";
import jwt from "@fastify/jwt";
import multipart from "@fastify/multipart";
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

  app.addHook("onReady", async () => {
    await ensureSuperadmin();
  });

  app.register(registerRoutes);

  return app;
}
