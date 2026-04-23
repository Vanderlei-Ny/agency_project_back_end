import { hashSync } from "bcryptjs";
import { prisma } from "../../database/prisma";

type AddAgencyMemberInput = {
  agencyId: string;
  name: string;
  email: string;
  password: string;
};

export async function addAgencyMember(input: AddAgencyMemberInput) {
  const { agencyId, name, email, password } = input;

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

  const newMember = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash: hashSync(password, 10),
      role: "AGENCY_MEMBER",
      agencyId,
    },
  });

  return {
    data: {
      id: newMember.id,
      name: newMember.name,
      email: newMember.email,
      role: newMember.role,
      agencyId: newMember.agencyId,
      createdAt: newMember.createdAt,
    },
    statusCode: 201 as const,
  };
}
