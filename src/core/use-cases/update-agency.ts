import { prisma } from "../../database/prisma";

type UpdateAgencyInput = {
  agencyId: string;
  name?: string;
  description?: string | null;
  phone?: string | null;
  iconAgency?: string;
};

export async function updateAgency(input: UpdateAgencyInput) {
  const { agencyId, name, description, phone, iconAgency } = input;

  const agency = await prisma.agency.findFirst({
    where: { id: agencyId, deletedAt: null },
  });

  if (!agency) {
    return { error: "Agencia nao encontrada.", statusCode: 404 as const };
  }

  const updateData: Record<string, string | boolean | null> = {};
  if (name !== undefined && name.trim()) updateData.name = name.trim();
  if (description !== undefined) {
    updateData.description = description === null ? null : description.trim() || null;
  }
  if (phone !== undefined) {
    updateData.phone = phone === null ? null : phone.trim() || null;
  }
  if (iconAgency !== undefined) {
    updateData.iconAgency = iconAgency.trim() || null;
  }

  if (Object.keys(updateData).length === 0) {
    return {
      error: "Nenhum dado para atualizar.",
      statusCode: 400 as const,
    };
  }

  const updatedAgency = await prisma.agency.update({
    where: { id: agencyId },
    data: updateData,
  });

  return {
    data: updatedAgency,
    statusCode: 200 as const,
  };
}
