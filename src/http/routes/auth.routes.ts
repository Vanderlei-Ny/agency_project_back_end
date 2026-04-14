import { FastifyInstance } from "fastify";
import {
  loginController,
  registerClientController,
} from "../controllers/auth.controller";

export async function authRoutes(app: FastifyInstance) {
  app.post<{
    Body: { name: string; email: string; password: string };
  }>("/auth/register-client", registerClientController);

  app.post<{
    Body: { email: string; password: string };
  }>("/auth/login", loginController);
}
