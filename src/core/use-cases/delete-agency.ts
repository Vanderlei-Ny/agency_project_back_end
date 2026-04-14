import { prisma } from "../../database/prisma";

export async function deleteAgency(agencyId: string) {
  const agency = await prisma.agency.findFirst({
    where: { id: agencyId, deletedAt: null },
  });
  if (!agency) {
    return { error: "Agencia nao encontrada.", statusCode: 404 as const };
  }

  const deletedAt = new Date();
  const deletedAgency = await prisma.agency.update({
    where: { id: agencyId },
    data: { deletedAt, statusAgency: false },
  });

  return {
    data: { id: deletedAgency.id, deletedAt: deletedAgency.deletedAt },
    statusCode: 200 as const,
  };
}
