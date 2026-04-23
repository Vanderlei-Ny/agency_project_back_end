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
    {
      schema: {
        security: [{ bearerAuth: [] }]
      },
      preHandler: [authenticateMiddleware, authorizeRoles("CLIENT")]
    },
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
      schema: {
        security: [{ bearerAuth: [] }],
        body: {
          type: "object",
          required: ["name"],
          properties: {
            name: { type: "string" },
            description: { type: "string" },
            phone: { type: "string" },
            iconAgency: { type: "string" },
          },
        },
      },
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
      schema: {
        security: [{ bearerAuth: [] }]
      },
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
      schema: {
        security: [{ bearerAuth: [] }],
        body: {
          type: "object",
          properties: {
            name: { type: "string" },
            description: { type: "string", nullable: true },
            phone: { type: "string", nullable: true },
            iconAgency: { type: "string" },
          },
        },
      },
      preHandler: [
        authenticateMiddleware,
        authorizeRoles("AGENCY_ADMIN", "SUPERADMIN"),
      ],
    },
    updateMyAgencyController,
  );
}