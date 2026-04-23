import { FastifyInstance } from "fastify";
import {
  createAgencyController,
  createAgencyUserController,
  deleteAgencyController,
  updateAgencyController,
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
    {
      schema: {
        security: [{ bearerAuth: [] }],
        body: {
          type: "object",
          required: ["name"],
          properties: {
            name: { type: "string" },
            adminName: { type: "string" },
            adminEmail: { type: "string" },
            adminPassword: { type: "string" },
          },
        },
      },
      preHandler: [authenticateMiddleware, authorizeRoles("SUPERADMIN")],
    },
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
    {
      schema: {
        security: [{ bearerAuth: [] }],
        params: {
          type: "object",
          properties: {
            agencyId: { type: "string" },
          },
        },
        body: {
          type: "object",
          required: ["name", "email", "password", "role"],
          properties: {
            name: { type: "string" },
            email: { type: "string" },
            password: { type: "string" },
            role: { type: "string", enum: ["AGENCY_ADMIN", "AGENCY_MEMBER"] },
          },
        },
      },
      preHandler: [authenticateMiddleware, authorizeRoles("SUPERADMIN")],
    },
    createAgencyUserController,
  );

  app.patch<{
    Params: { agencyId: string };
    Body: { name: string };
  }>(
    "/admin/agencies/:agencyId",
    {
      schema: {
        security: [{ bearerAuth: [] }],
        params: {
          type: "object",
          properties: {
            agencyId: { type: "string" },
          },
        },
        body: {
          type: "object",
          required: ["name"],
          properties: {
            name: { type: "string" },
          },
        },
      },
      preHandler: [authenticateMiddleware, authorizeRoles("SUPERADMIN")],
    },
    updateAgencyController,
  );

  app.delete<{ Params: { agencyId: string } }>(
    "/admin/agencies/:agencyId",
    {
      schema: {
        security: [{ bearerAuth: [] }],
        params: {
          type: "object",
          properties: {
            agencyId: { type: "string" },
          },
        },
      },
      preHandler: [authenticateMiddleware, authorizeRoles("SUPERADMIN")],
    },
    deleteAgencyController,
  );
}