import { compareSync } from "bcryptjs";
import { users } from "../../database/in-memory-db";

type LoginInput = {
  email: string;
  password: string;
};

export function authenticateUser(input: LoginInput) {
  const { email, password } = input;

  const user = users.find((item) => item.email === email);

  if (!user || !compareSync(password, user.passwordHash)) {
    return { error: "Credenciais invalidas.", statusCode: 401 as const };
  }

  return {
    data: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      agencyId: user.agencyId ?? null,
    },
    statusCode: 200 as const,
  };
}
