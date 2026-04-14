import { FastifyReply, FastifyRequest } from "fastify";
import { Role } from "../../core/types/auth";
import { getAuthUser } from "./get-auth-user";

export function authorizeRoles(...allowedRoles: Role[]) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const user = getAuthUser(request);

    if (!user || !allowedRoles.includes(user.role)) {
      return reply
        .code(403)
        .send({ message: "Acesso negado para este perfil." });
    }
  };
}
