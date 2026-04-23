import { prisma } from "../../database/prisma";

export async function listAgencyMembers(userId: string) {
  try {
    const requestUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { agencyId: true }
    });

    if (!requestUser || !requestUser.agencyId) {
      return {
        error: "Usuário não pertence a nenhuma agência.",
        statusCode: 404
      };
    }

    const members = await prisma.user.findMany({
      where: { 
        agencyId: requestUser.agencyId 
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      },
      orderBy: {
        name: 'asc'
      }
    });

    return {
      data: members
    };

  } catch (error) {
    console.error(error);
    return {
      error: "Erro interno ao listar membros da agência.",
      statusCode: 500
    };
  }
}