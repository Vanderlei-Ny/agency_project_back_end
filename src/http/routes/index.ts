import { FastifyInstance } from "fastify";
import { adminRoutes } from "./admin.routes";
import { authRoutes } from "./auth.routes";
import { usersRoutes } from "./users.routes";

export async function registerRoutes(app: FastifyInstance) {
  app.get("/", async () => ({ ok: true, service: "agency_project_back_end" }));

  await app.register(authRoutes);
  await app.register(adminRoutes);
  await app.register(usersRoutes);
}
