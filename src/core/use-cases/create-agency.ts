import { hashSync } from "bcryptjs";
import { randomUUID } from "node:crypto";
import { agencies, users } from "../../database/in-memory-db";
import { AgencyRecord, UserRecord } from "../types/records";

type CreateAgencyInput = {
  name: string;
  adminName?: string;
  adminEmail?: string;
  adminPassword?: string;
};

export function createAgency(input: CreateAgencyInput) {
  const { name, adminName, adminEmail, adminPassword } = input;

  const agency: AgencyRecord = {
    id: randomUUID(),
    name,
  };

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

    const alreadyExists = users.some((user) => user.email === adminEmail);
    if (alreadyExists) {
      return {
        error: "E-mail do admin ja cadastrado.",
        statusCode: 409 as const,
      };
    }

    const newAdmin: UserRecord = {
      id: randomUUID(),
      name: adminName,
      email: adminEmail,
      passwordHash: hashSync(adminPassword, 10),
      role: "AGENCY_ADMIN",
      agencyId: agency.id,
    };

    users.push(newAdmin);
    agencyAdmin = {
      id: newAdmin.id,
      name: newAdmin.name,
      email: newAdmin.email,
      role: "AGENCY_ADMIN",
      agencyId: newAdmin.agencyId,
    };
  }

  agencies.push(agency);

  return {
    data: { agency, agencyAdmin },
    statusCode: 201 as const,
  };
}
