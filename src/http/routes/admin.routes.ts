import { FastifyInstance } from "fastify";
import {
  createAgencyController,
  createAgencyUserController,
} from "../controllers/admin.controller";
import { authenticateMiddleware } from "../middlewares/authenticate";
import { authorizeRoles } from "../middlewares/authorize";

export async function adminRoutes(app: FastifyInstance) {
  app.post<{
    Body: {
      name: string;
      adminName?: string;
      adminEmail?: string;
      adminPassword?: string;
    };
  }>(
    "/admin/agencies",
    { preHandler: [authenticateMiddleware, authorizeRoles("SUPERADMIN")] },
    createAgencyController,
  );

  app.post<{
    Params: { agencyId: string };
    Body: {
      name: string;
      email: string;
      password: string;
      role: "AGENCY_ADMIN" | "AGENCY_MEMBER";
    };
  }>(
    "/admin/agencies/:agencyId/users",
    { preHandler: [authenticateMiddleware, authorizeRoles("SUPERADMIN")] },
    createAgencyUserController,
  );
}
