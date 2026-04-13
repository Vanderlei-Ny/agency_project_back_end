import { FastifyReply, FastifyRequest } from "fastify";
import { getCurrentUser } from "../../core/use-cases/get-current-user";

export async function meController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const result = getCurrentUser(request.user.id);

  if ("error" in result) {
    return reply.code(result.statusCode).send({ message: result.error });
  }

  return reply.send(result.data);
}
