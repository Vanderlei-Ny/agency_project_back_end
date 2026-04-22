import { FormStatus } from "@prisma/client";
import { prisma } from "../../database/prisma";

type UpdateFormStatusInput = {
  formId: string;
  agencyId: string;
  status: "IN_PROGRESS" | "DELIVERED";
};

const allowedTransitions: Record<FormStatus, FormStatus[]> = {
  PENDING_BUDGET: [],
  BUDGET_SENT: [],
  APPROVED: ["IN_PROGRESS"],
  REJECTED: [],
  IN_PROGRESS: ["DELIVERED"],
  DELIVERED: [],
};

export async function updateFormStatus(input: UpdateFormStatusInput) {
  const { formId, agencyId, status } = input;

  const form = await prisma.form.findFirst({
    where: { id: formId, agencyId, deletedAt: null },
  });

  if (!form) {
    return { error: "Formulario nao encontrado.", statusCode: 404 as const };
  }

  const validNext = allowedTransitions[form.status as FormStatus];

  if (!validNext.includes(status)) {
    return {
      error: "Transicao de status invalida.",
      statusCode: 400 as const,
    };
  }

  const updated = await prisma.form.update({
    where: { id: formId },
    data: { status },
    include: {
      client: {
        select: { id: true, name: true, email: true },
      },
      agency: {
        select: { id: true, name: true },
      },
      colors: true,
    },
  });

  return {
    data: updated,
    statusCode: 200 as const,
  };
}
