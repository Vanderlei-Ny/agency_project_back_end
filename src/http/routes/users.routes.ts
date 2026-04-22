import { FastifyInstance } from "fastify";
import { meController } from "../controllers/users.controller";
import { authenticateMiddleware } from "../middlewares/authenticate";

export async function usersRoutes(app: FastifyInstance) {
  app.get("/me", { preHandler: [authenticateMiddleware] }, meController);
}
