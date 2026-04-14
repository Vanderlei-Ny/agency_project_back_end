import { FastifyReply, FastifyRequest } from "fastify";
import { getCurrentUser } from "../../core/use-cases/get-current-user";
import { getAuthUser } from "../middlewares/get-auth-user";

export async function meController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const user = getAuthUser(request);

  if (!user) {
    return reply.code(401).send({ message: "Token invalido ou ausente." });
  }

  const result = await getCurrentUser(user.id);

  if ("error" in result) {
    return reply.code(result.statusCode).send({ message: result.error });
  }

  return reply.send(result.data);
}
