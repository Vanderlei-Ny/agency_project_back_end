import { FastifyReply, FastifyRequest } from "fastify";
import { Role } from "../../core/types/auth";

export function authorizeRoles(...allowedRoles: Role[]) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    if (!request.user || !allowedRoles.includes(request.user.role)) {
      reply.code(403).send({ message: "Acesso negado para este perfil." });
    }
  };
}
