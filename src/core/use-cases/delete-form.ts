import { prisma } from "../../database/prisma";

type DeleteFormInput = {
  formId: string;
  clientId: string;
};

export async function deleteForm(input: DeleteFormInput) {
  const { formId, clientId } = input;

  const form = await prisma.form.findFirst({
    where: { id: formId, clientId, deletedAt: null },
  });

  if (!form) {
    return { error: "Formulario nao encontrado.", statusCode: 404 as const };
  }

  const deleted = await prisma.form.update({
    where: { id: formId },
    data: { deletedAt: new Date() },
  });

  return {
    data: { id: deleted.id, deletedAt: deleted.deletedAt },
    statusCode: 200 as const,
  };
}
