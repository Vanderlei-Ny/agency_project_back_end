import { FastifyReply, FastifyRequest } from "fastify";
import { listActiveAgencies } from "../../core/use-cases/list-active-agencies";

export async function listAgenciesController(
  _request: FastifyRequest,
  reply: FastifyReply,
) {
  const result = listActiveAgencies();
  return reply.code(result.statusCode).send(result.data);
}
