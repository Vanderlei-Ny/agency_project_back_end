import { prisma } from "../../database/prisma";

type CreateFormInput = {
  clientId: string;
  agencyId: string;
  description: string;
};

export async function createForm(input: CreateFormInput) {
  const { clientId, agencyId, description } = input;

  const agency = await prisma.agency.findFirst({
    where: { id: agencyId, deletedAt: null, statusAgency: true },
  });

  if (!agency) {
    return { error: "Agencia nao encontrada.", statusCode: 404 as const };
  }

  const form = await prisma.form.create({
    data: {
      clientId,
      agencyId,
      description,
      status: "PENDING_BUDGET",
    },
  });

  return {
    data: form,
    statusCode: 201 as const,
  };
}
