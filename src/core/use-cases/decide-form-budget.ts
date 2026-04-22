import { prisma } from "../../database/prisma";

type DecideFormBudgetInput = {
  formId: string;
  clientId: string;
  approved: boolean;
  paymentMethod?: string;
  rejectionReason?: string;
};

export async function decideFormBudget(input: DecideFormBudgetInput) {
  const { formId, clientId, approved, paymentMethod, rejectionReason } = input;

  const form = await prisma.form.findFirst({
    where: { id: formId, clientId, deletedAt: null },
  });

  if (!form) {
    return { error: "Formulario nao encontrado.", statusCode: 404 as const };
  }

  if (form.status !== "BUDGET_SENT") {
    return {
      error: "Somente formularios com orcamento enviado podem ser decididos.",
      statusCode: 400 as const,
    };
  }

  if (approved && !paymentMethod) {
    return {
      error: "Informe paymentMethod ao aprovar o orcamento.",
      statusCode: 400 as const,
    };
  }

  if (!approved && !rejectionReason) {
    return {
      error: "Informe rejectionReason ao recusar o orcamento.",
      statusCode: 400 as const,
    };
  }

  const updated = await prisma.form.update({
    where: { id: formId },
    data: approved
      ? {
          status: "APPROVED",
          paymentMethod,
          rejectionReason: null,
        }
      : {
          status: "REJECTED",
          rejectionReason,
          paymentMethod: null,
        },
    include: {
      agency: { select: { id: true, name: true } },
      colors: true,
    },
  });

  return {
    data: updated,
    statusCode: 200 as const,
  };
}
