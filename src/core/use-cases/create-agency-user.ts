import { hashSync } from "bcryptjs";
import { randomUUID } from "node:crypto";
import { agencies, users } from "../../database/in-memory-db";

type CreateAgencyUserInput = {
  agencyId: string;
  name: string;
  email: string;
  password: string;
  role: "AGENCY_ADMIN" | "AGENCY_MEMBER";
};

export function createAgencyUser(input: CreateAgencyUserInput) {
  const { agencyId, name, email, password, role } = input;

  const agency = agencies.find((item) => item.id === agencyId);
  if (!agency) {
    return { error: "Agencia nao encontrada.", statusCode: 404 as const };
  }

  const alreadyExists = users.some((user) => user.email === email);
  if (alreadyExists) {
    return { error: "E-mail ja cadastrado.", statusCode: 409 as const };
  }

  const newAgencyUser = {
    id: randomUUID(),
    name,
    email,
    passwordHash: hashSync(password, 10),
    role,
    agencyId,
  };

  users.push(newAgencyUser);

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
