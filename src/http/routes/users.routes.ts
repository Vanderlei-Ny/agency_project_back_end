import { FastifyInstance } from "fastify";
import { meController } from "../controllers/users.controller";
import { authenticateMiddleware } from "../middlewares/authenticate";

export async function usersRoutes(app: FastifyInstance) {
  app.get("/me", {
    schema: {
      // O cadeado para o seu perfil de usuário
      security: [{ bearerAuth: [] }],
    },
    preHandler: [authenticateMiddleware]
  }, meController);
}