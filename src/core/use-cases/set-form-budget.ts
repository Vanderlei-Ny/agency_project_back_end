import { prisma } from "../../database/prisma";

type SetFormBudgetInput = {
  formId: string;
  agencyId: string;
  budgetValue: string;
};

export async function setFormBudget(input: SetFormBudgetInput) {
  const { formId, agencyId, budgetValue } = input;

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

  const updated = await prisma.form.update({
    where: { id: formId },
    data: {
      budgetValue,
      status: "BUDGET_SENT",
      rejectionReason: null,
    },
  });

  return {
    data: updated,
    statusCode: 200 as const,
  };
}
