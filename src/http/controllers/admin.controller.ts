import { FastifyReply, FastifyRequest } from "fastify";
import { createAgency } from "../../core/use-cases/create-agency";
import { createAgencyUser } from "../../core/use-cases/create-agency-user";

export async function createAgencyController(
  request: FastifyRequest<{
    Body: {
      name: string;
      adminName?: string;
      adminEmail?: string;
      adminPassword?: string;
    };
  }>,
  reply: FastifyReply,
) {
  const result = createAgency(request.body);

  if ("error" in result) {
    return reply.code(result.statusCode).send({ message: result.error });
  }

  return reply.code(result.statusCode).send(result.data);
}

export async function createAgencyUserController(
  request: FastifyRequest<{
    Params: { agencyId: string };
    Body: {
      name: string;
      email: string;
      password: string;
      role: "AGENCY_ADMIN" | "AGENCY_MEMBER";
    };
  }>,
  reply: FastifyReply,
) {
  const result = createAgencyUser({
    agencyId: request.params.agencyId,
    ...request.body,
  });

  if ("error" in result) {
    return reply.code(result.statusCode).send({ message: result.error });
  }

  return reply.code(result.statusCode).send(result.data);
}
