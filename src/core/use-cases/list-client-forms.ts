import { prisma } from "../../database/prisma";

type ListClientFormsInput = {
  clientId: string;
};

export async function listClientForms(input: ListClientFormsInput) {
  const forms = await prisma.form.findMany({
    where: { clientId: input.clientId, deletedAt: null },
    include: {
      agency: {
        select: { id: true, name: true },
      },
      colors: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return {
    data: forms,
    statusCode: 200 as const,
  };
}
