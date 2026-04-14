import { prisma } from "../../database/prisma";

type ListAgencyFormsInput = {
  agencyId: string;
};

export async function listAgencyForms(input: ListAgencyFormsInput) {
  const forms = await prisma.form.findMany({
    where: { agencyId: input.agencyId, deletedAt: null },
    include: {
      client: {
        select: { id: true, name: true, email: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return {
    data: forms,
    statusCode: 200 as const,
  };
}
