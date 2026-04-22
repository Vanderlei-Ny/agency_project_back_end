import { prisma } from "../../database/prisma";

type GetClientFormInput = {
  formId: string;
  clientId: string;
};

export async function getClientForm(input: GetClientFormInput) {
  const form = await prisma.form.findFirst({
    where: {
      id: input.formId,
      clientId: input.clientId,
      deletedAt: null,
    },
    include: {
      agency: {
        select: { id: true, name: true },
      },
      colors: true,
    },
  });

  if (!form) {
    return {
      error: "Solicitação não encontrada.",
      statusCode: 404 as const,
    };
  }

  return {
    data: form,
    statusCode: 200 as const,
  };
}
