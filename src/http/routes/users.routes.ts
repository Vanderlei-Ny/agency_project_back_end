import { FastifyInstance } from "fastify";
import { meController } from "../controllers/users.controller";

export async function usersRoutes(app: FastifyInstance) {
  app.get("/me", { preHandler: [app.authenticate] }, meController);
}
