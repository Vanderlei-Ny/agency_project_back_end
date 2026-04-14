import { prisma } from "../../database/prisma";

type UpdateAgencyInput = {
  agencyId: string;
  name: string;
};

export async function updateAgency(input: UpdateAgencyInput) {
  const { agencyId, name } = input;

  const agency = await prisma.agency.findFirst({
    where: { id: agencyId, deletedAt: null },
  });
  if (!agency) {
    return { error: "Agencia nao encontrada.", statusCode: 404 as const };
  }

  const updatedAgency = await prisma.agency.update({
    where: { id: agencyId },
    data: { name },
  });

  return {
    data: updatedAgency,
    statusCode: 200 as const,
  };
}
