import { hashSync } from "bcryptjs";
import { prisma } from "../../database/prisma";

type CreateAgencyInput = {
  name: string;
  adminName?: string;
  adminEmail?: string;
  adminPassword?: string;
};

export async function createAgency(input: CreateAgencyInput) {
  const { name, adminName, adminEmail, adminPassword } = input;

  let agencyAdmin: {
    id: string;
    name: string;
    email: string;
    role: "AGENCY_ADMIN";
    agencyId?: string;
  } | null = null;

  if (adminName || adminEmail || adminPassword) {
    if (!adminName || !adminEmail || !adminPassword) {
      return {
        error:
          "Para criar admin da agencia, envie adminName, adminEmail e adminPassword.",
        statusCode: 400 as const,
      };
    }

    const alreadyExists = await prisma.user.findUnique({
      where: { email: adminEmail },
    });
    if (alreadyExists) {
      return {
        error: "E-mail do admin ja cadastrado.",
        statusCode: 409 as const,
      };
    }
  }

  const agency = await prisma.$transaction(async (tx) => {
    const createdAgency = await tx.agency.create({
      data: { name },
    });

    if (adminName && adminEmail && adminPassword) {
      const newAdmin = await tx.user.create({
        data: {
          name: adminName,
          email: adminEmail,
          passwordHash: hashSync(adminPassword, 10),
          role: "AGENCY_ADMIN",
          agencyId: createdAgency.id,
        },
      });

      agencyAdmin = {
        id: newAdmin.id,
        name: newAdmin.name,
        email: newAdmin.email,
        role: "AGENCY_ADMIN",
        agencyId: newAdmin.agencyId ?? undefined,
      };
    }

    return createdAgency;
  });

  return {
    data: { agency, agencyAdmin },
    statusCode: 201 as const,
  };
}
