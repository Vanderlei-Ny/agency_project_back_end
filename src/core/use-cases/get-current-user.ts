import { users } from "../../database/in-memory-db";

export function getCurrentUser(userId: string) {
  const user = users.find((item) => item.id === userId);

  if (!user) {
    return { error: "Usuario nao encontrado.", statusCode: 404 as const };
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
