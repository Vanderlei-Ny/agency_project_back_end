import { FastifyReply, FastifyRequest } from "fastify";

export async function authenticateMiddleware(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    await request.jwtVerify();
  } catch {
    reply.code(401).send({ message: "Token invalido ou ausente." });
  }
}
