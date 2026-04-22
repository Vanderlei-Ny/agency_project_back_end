import { prisma } from "../../database/prisma";

interface RespondFormInput {
  formId: string;
  agencyId: string;
  feedback: string;
}

/** Recusa explícita da agência (antes ou depois de enviar orçamento). */
export async function respondForm(input: RespondFormInput) {
  try {
    // Verificar se form existe e pertence à agência
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
      },
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
