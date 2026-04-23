import { prisma } from "../../database/prisma";

interface RespondFormInput {
  formId: string;
  agencyId: string;
  feedback: string;
  respondedByUserId?: string;
}

export async function respondForm(input: RespondFormInput) {
  try {
    const form = await prisma.form.findFirst({
      where: {
        id: input.formId,
        agencyId: input.agencyId,
      },
    });

    if (!form) {
      return {
        statusCode: 404,
        error: "Solicitação não encontrada ou não pertence a esta agência",
      };
    }

    if (form.status !== "PENDING_BUDGET" && form.status !== "BUDGET_SENT") {
      return {
        statusCode: 400,
        error:
          "Só é possível recusar enquanto a solicitação aguarda análise ou resposta do cliente sobre o orçamento.",
      };
    }

    const updatedForm = await prisma.form.update({
      where: { id: input.formId },
      data: {
        agencyFeedback: input.feedback,
        rejectionReason: input.feedback,
        status: "REJECTED" as const,
        respondedByUserId: input.respondedByUserId,
        respondedAt: input.respondedByUserId ? new Date() : undefined,
      },
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
      statusCode: 200,
      data: updatedForm,
    };
  } catch (error) {
    console.error("Erro ao responder formulário:", error);
    return {
      statusCode: 500,
      error: "Erro ao processar resposta",
    };
  }
}
