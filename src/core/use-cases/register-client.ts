import { hashSync } from "bcryptjs";
import { prisma } from "../../database/prisma";

type RegisterClientInput = {
  name: string;
  email: string;
  password: string;
};

export async function registerClient(input: RegisterClientInput) {
  const { name, email, password } = input;

  const alreadyExists = await prisma.user.findUnique({ where: { email } });
  if (alreadyExists) {
    return { error: "E-mail ja cadastrado.", statusCode: 409 as const };
  }

  const newClient = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash: hashSync(password, 10),
      role: "CLIENT",
    },
  });

  return {
    data: {
      id: newClient.id,
      name: newClient.name,
      email: newClient.email,
      role: newClient.role,
      agencyId: newClient.agencyId ?? null,
    },
    statusCode: 201 as const,
  };
}
