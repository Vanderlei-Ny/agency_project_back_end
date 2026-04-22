import { FastifyReply, FastifyRequest } from "fastify";
import { authenticateUser } from "../../core/use-cases/authenticate-user";
import { registerClient } from "../../core/use-cases/register-client";

export async function registerClientController(
  request: FastifyRequest<{
    Body: { name: string; email: string; password: string };
  }>,
  reply: FastifyReply,
) {
  const result = await registerClient(request.body);

  if ("error" in result) {
    return reply.code(result.statusCode).send({ message: result.error });
  }

  const token = request.server.jwt.sign({
    id: result.data.id,
    email: result.data.email,
    role: result.data.role,
    agencyId: result.data.agencyId ?? undefined,
  });

  return reply.code(result.statusCode).send({ token, user: result.data });
}

export async function loginController(
  request: FastifyRequest<{ Body: { email: string; password: string } }>,
  reply: FastifyReply,
) {
  const result = await authenticateUser(request.body);

  if ("error" in result) {
    return reply.code(result.statusCode).send({ message: result.error });
  }

  const token = request.server.jwt.sign({
    id: result.data.id,
    email: result.data.email,
    role: result.data.role,
    agencyId: result.data.agencyId,
  });

  return reply.send({ token, user: result.data });
}
