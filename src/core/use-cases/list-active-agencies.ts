import { prisma } from "../../database/prisma";

export async function listActiveAgencies() {
  const activeAgencies = await prisma.agency.findMany({
    where: { deletedAt: null, statusAgency: true },
    orderBy: { createdAt: "desc" },
  });

  return {
    data: activeAgencies,
    statusCode: 200 as const,
  };
}
