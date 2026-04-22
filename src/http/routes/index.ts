import { FastifyInstance } from "fastify";
import { agenciesRoutes } from "./agencies.routes";
import { adminRoutes } from "./admin.routes";
import { authRoutes } from "./auth.routes";
import { formsRoutes } from "./forms.routes";
import { usersRoutes } from "./users.routes";

export async function registerRoutes(app: FastifyInstance) {
  app.get("/", async () => ({ ok: true, service: "agency_project_back_end" }));

  await app.register(authRoutes);
  await app.register(adminRoutes);
  await app.register(agenciesRoutes);
  await app.register(formsRoutes);
  await app.register(usersRoutes);
}
