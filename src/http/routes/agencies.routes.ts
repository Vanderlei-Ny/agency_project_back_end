import { FastifyInstance } from "fastify";
import {
  listAgenciesController,
  createAgencyController,
  getMyAgencyController,
  updateMyAgencyController,
  addAgencyMemberController,
} from "../controllers/agencies.controller";
import { listAgencyMembersController } from "../controllers/users.controller";
import { authenticateMiddleware } from "../middlewares/authenticate";
import { authorizeRoles } from "../middlewares/authorize";

export async function agenciesRoutes(app: FastifyInstance) {
  app.get(
    "/agencies",
    {
      preHandler: [authenticateMiddleware, authorizeRoles("CLIENT")],
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

  app.get(
    "/agency/members",
    {
      preHandler: [
        authenticateMiddleware,
        authorizeRoles("AGENCY_ADMIN", "AGENCY_MEMBER"),
      ],
    },
    listAgencyMembersController,
  );

  app.post<{
    Body: {
      name: string;
      email: string;
      password: string;
    };
  }>(
    "/agency/members",
    {
      schema: {
        body: {
          type: "object",
          required: ["name", "email", "password"],
          properties: {
            name: { type: "string" },
            email: { type: "string" },
            password: { type: "string" },
          },
        },
      },
      preHandler: [
        authenticateMiddleware,
        authorizeRoles("AGENCY_ADMIN", "SUPERADMIN"),
      ],
    },
    addAgencyMemberController,
  );
}