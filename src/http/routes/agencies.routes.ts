import { FastifyInstance } from "fastify";
import {
  listAgenciesController,
  createAgencyController,
  getMyAgencyController,
  updateMyAgencyController,
} from "../controllers/agencies.controller";
import { authenticateMiddleware } from "../middlewares/authenticate";
import { authorizeRoles } from "../middlewares/authorize";

export async function agenciesRoutes(app: FastifyInstance) {
  app.get(
    "/agencies",
    { preHandler: [authenticateMiddleware, authorizeRoles("CLIENT")] },
    listAgenciesController,
  );

  app.post<{
    Body: {
      name: string;
      description?: string;
      phone?: string;
      iconAgency?: string;
    };
  }>(
    "/agencies",
    {
      preHandler: [
        authenticateMiddleware,
        authorizeRoles("CLIENT", "AGENCY_ADMIN", "AGENCY_MEMBER"),
      ],
    },
    createAgencyController,
  );

  app.get(
    "/agency/me",
    {
      preHandler: [
        authenticateMiddleware,
        authorizeRoles("AGENCY_ADMIN", "AGENCY_MEMBER"),
      ],
    },
    getMyAgencyController,
  );

  app.patch<{
    Body: {
      name?: string;
      description?: string | null;
      phone?: string | null;
      iconAgency?: string;
    };
  }>(
    "/agency/me",
    {
      preHandler: [
        authenticateMiddleware,
        authorizeRoles("AGENCY_ADMIN", "SUPERADMIN"),
      ],
    },
    updateMyAgencyController,
  );
}
