import { prisma } from "../../database/prisma";

type CreateFormInput = {
  clientId: string;
  agencyId: string;
  description: string;
  colors?: Array<{ name: string; hexCode: string }>;
};

export async function createForm(input: CreateFormInput) {
  const { clientId, agencyId, description, colors } = input;

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
      colors:
        colors && colors.length > 0
          ? {
              create: colors.map((c) => ({
                name: c.name,
                hexCode: c.hexCode,
              })),
            }
          : undefined,
    },
    include: {
      agency: { select: { id: true, name: true } },
      colors: true,
    },
  });

  return {
    data: form,
    statusCode: 201 as const,
  };
}
