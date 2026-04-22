import { prisma } from "../../database/prisma";

type CreateUserAgencyInput = {
  userId: string;
  agencyName: string;
  description?: string;
  phone?: string;
  iconAgency?: string;
};

export async function createUserAgency(input: CreateUserAgencyInput) {
  const { userId, agencyName, description, phone, iconAgency } = input;

  // Verificar se o usuário existe
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    return {
      error: "Usuário não encontrado.",
      statusCode: 404 as const,
    };
  }

  // Verificar se o usuário já tem uma agência
  if (user.agencyId) {
    return {
      error: "Usuário já está vinculado a uma agência.",
      statusCode: 400 as const,
    };
  }

  const agency = await prisma.$transaction(async (tx) => {
    // Criar a agência
    const createdAgency = await tx.agency.create({
      data: {
        name: agencyName,
        description: description?.trim() || null,
        phone: phone?.trim() || null,
        iconAgency: iconAgency?.trim() || null,
      },
    });

    // Atualizar o usuário para AGENCY_ADMIN e vincular à agência
    await tx.user.update({
      where: { id: userId },
      data: {
        role: "AGENCY_ADMIN",
        agencyId: createdAgency.id,
      },
    });

    return createdAgency;
  });

  return {
    data: agency,
    statusCode: 201 as const,
  };
}
