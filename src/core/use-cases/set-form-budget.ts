import type { Prisma } from "@prisma/client";
import { prisma } from "../../database/prisma";

type SetFormBudgetInput = {
  formId: string;
  agencyId: string;
  budgetValue: string;
  budgetMessage?: string | null;
  respondedByUserId?: string;
};

export async function setFormBudget(input: SetFormBudgetInput) {
  const { formId, agencyId, budgetValue, budgetMessage, respondedByUserId } = input;

  const form = await prisma.form.findFirst({
    where: { id: formId, agencyId, deletedAt: null },
  });

  if (!form) {
    return { error: "Formulario nao encontrado.", statusCode: 404 as const };
  }

  if (form.status !== "PENDING_BUDGET" && form.status !== "REJECTED") {
    return {
      error: "Nao e possivel enviar orcamento no status atual.",
      statusCode: 400 as const,
    };
  }

  const data: Prisma.FormUpdateInput = {
    budgetValue,
    status: "BUDGET_SENT",
    rejectionReason: null,
  };

  if (budgetMessage !== undefined) {
    data.budgetMessage =
      budgetMessage == null || !String(budgetMessage).trim()
        ? null
        : String(budgetMessage).trim();
  }

  if (respondedByUserId) {
    data.respondedByUser = { connect: { id: respondedByUserId } };
    data.respondedAt = new Date();
  }

  const updated = await prisma.form.update({
    where: { id: formId },
    data,
    include: {
      client: {
        select: { id: true, name: true, email: true },
      },
      agency: {
        select: { id: true, name: true },
      },
      respondedByUser: {
        select: { id: true, name: true, email: true },
      },
      colors: true,
    },
  });

  return {
    data: updated,
    statusCode: 200 as const,
  };
}
