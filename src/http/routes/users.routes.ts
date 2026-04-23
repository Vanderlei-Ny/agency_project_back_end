import { FastifyInstance } from "fastify";
import { 
  meController,
  listAgencyMembersController,
  createAgencyMemberController 
} from "../controllers/users.controller";
import { authenticateMiddleware } from "../middlewares/authenticate";

export async function usersRoutes(app: FastifyInstance) {
  
  app.get("/me", {
    preHandler: [authenticateMiddleware]
  }, meController);

  app.get("/users/agency", {
    preHandler: [authenticateMiddleware]
  }, listAgencyMembersController);

  app.post("/users/agency", {
    preHandler: [authenticateMiddleware],
  }, createAgencyMemberController);
}