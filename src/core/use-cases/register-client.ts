import { hashSync } from "bcryptjs";
import { randomUUID } from "node:crypto";
import { users } from "../../database/in-memory-db";
import { UserRecord } from "../types/records";

type RegisterClientInput = {
  name: string;
  email: string;
  password: string;
};

export function registerClient(input: RegisterClientInput) {
  const { name, email, password } = input;

  const alreadyExists = users.some((user) => user.email === email);
  if (alreadyExists) {
    return { error: "E-mail ja cadastrado.", statusCode: 409 as const };
  }

  const newClient: UserRecord = {
    id: randomUUID(),
    name,
    email,
    passwordHash: hashSync(password, 10),
    role: "CLIENT",
  };

  users.push(newClient);

  return {
    data: {
      id: newClient.id,
      name: newClient.name,
      email: newClient.email,
      role: newClient.role,
    },
    statusCode: 201 as const,
  };
}
