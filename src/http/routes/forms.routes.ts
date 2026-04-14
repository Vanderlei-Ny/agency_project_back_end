import { FastifyInstance } from "fastify";
import {
  createFormController,
  decideFormBudgetController,
  deleteFormController,
  listAgencyFormsController,
  listClientFormsController,
  setFormBudgetController,
  updateFormStatusController,
} from "../controllers/forms.controller";
import { authenticateMiddleware } from "../middlewares/authenticate";
import { authorizeRoles } from "../middlewares/authorize";

export async function formsRoutes(app: FastifyInstance) {
  app.post<{
    Body: { agencyId: string; description: string };
  }>(
    "/forms",
    { preHandler: [authenticateMiddleware, authorizeRoles("CLIENT")] },
    createFormController,
  );

  app.get(
    "/forms/my",
    { preHandler: [authenticateMiddleware, authorizeRoles("CLIENT")] },
    listClientFormsController,
  );

  app.patch<{
    Params: { formId: string };
    Body: {
      approved: boolean;
      paymentMethod?: string;
      rejectionReason?: string;
    };
  }>(
    "/forms/:formId/decision",
    { preHandler: [authenticateMiddleware, authorizeRoles("CLIENT")] },
    decideFormBudgetController,
  );

  app.delete<{ Params: { formId: string } }>(
    "/forms/:formId",
    { preHandler: [authenticateMiddleware, authorizeRoles("CLIENT")] },
    deleteFormController,
  );

  app.get(
    "/agency/forms",
    {
      preHandler: [
        authenticateMiddleware,
        authorizeRoles("AGENCY_ADMIN", "AGENCY_MEMBER"),
      ],
    },
    listAgencyFormsController,
  );

  app.patch<{
    Params: { formId: string };
    Body: { budgetValue: string };
  }>(
    "/agency/forms/:formId/budget",
    {
      preHandler: [
        authenticateMiddleware,
        authorizeRoles("AGENCY_ADMIN", "AGENCY_MEMBER"),
      ],
    },
    setFormBudgetController,
  );

  app.patch<{
    Params: { formId: string };
    Body: { status: "IN_PROGRESS" | "DELIVERED" };
  }>(
    "/agency/forms/:formId/status",
    {
      preHandler: [
        authenticateMiddleware,
        authorizeRoles("AGENCY_ADMIN", "AGENCY_MEMBER"),
      ],
    },
    updateFormStatusController,
  );
}
