import { hashSync } from "bcryptjs";
import { prisma } from "../../database/prisma";

type CreateAgencyUserInput = {
  agencyId: string;
  name: string;
  email: string;
  password: string;
  role: "AGENCY_ADMIN" | "AGENCY_MEMBER";
};

export async function createAgencyUser(input: CreateAgencyUserInput) {
  const { agencyId, name, email, password, role } = input;

  const agency = await prisma.agency.findFirst({
    where: { id: agencyId, deletedAt: null, statusAgency: true },
  });
  if (!agency) {
    return { error: "Agencia nao encontrada.", statusCode: 404 as const };
  }

  const alreadyExists = await prisma.user.findUnique({ where: { email } });
  if (alreadyExists) {
    return { error: "E-mail ja cadastrado.", statusCode: 409 as const };
  }

  const newAgencyUser = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash: hashSync(password, 10),
      role,
      agencyId,
    },
  });

  return {
    data: {
      id: newAgencyUser.id,
      name: newAgencyUser.name,
      email: newAgencyUser.email,
      role: newAgencyUser.role,
      agencyId: newAgencyUser.agencyId,
    },
    statusCode: 201 as const,
  };
}
