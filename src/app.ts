import Fastify, { FastifyInstance } from "fastify";
import jwt from "@fastify/jwt";
import { ensureSuperadmin } from "./core/use-cases/ensure-superadmin";
import { registerRoutes } from "./http/routes";

export function buildApp(): FastifyInstance {
  const app = Fastify({ logger: true });

  app.register(jwt, {
    secret: process.env.JWT_SECRET ?? "dev-secret-change-me",
  });

  app.addHook("onReady", async () => {
    await ensureSuperadmin();
  });

  app.register(registerRoutes);

  return app;
}
