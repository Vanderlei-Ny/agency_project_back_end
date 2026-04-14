import { FastifyInstance } from "fastify";
import { listAgenciesController } from "../controllers/agencies.controller";
import { authenticateMiddleware } from "../middlewares/authenticate";
import { authorizeRoles } from "../middlewares/authorize";

export async function agenciesRoutes(app: FastifyInstance) {
  app.get(
    "/agencies",
    { preHandler: [authenticateMiddleware, authorizeRoles("CLIENT")] },
    listAgenciesController,
  );
}
