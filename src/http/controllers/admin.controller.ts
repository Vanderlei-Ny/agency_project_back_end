import { FastifyReply, FastifyRequest } from "fastify";
import { createAgency } from "../../core/use-cases/create-agency";
import { createAgencyUser } from "../../core/use-cases/create-agency-user";
import { deleteAgency } from "../../core/use-cases/delete-agency";
import { updateAgency } from "../../core/use-cases/update-agency";

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

export async function updateAgencyController(
  request: FastifyRequest<{
    Params: { agencyId: string };
    Body: { name: string };
  }>,
  reply: FastifyReply,
) {
  const result = updateAgency({
    agencyId: request.params.agencyId,
    name: request.body.name,
  });

  if ("error" in result) {
    return reply.code(result.statusCode).send({ message: result.error });
  }

  return reply.code(result.statusCode).send(result.data);
}

export async function deleteAgencyController(
  request: FastifyRequest<{ Params: { agencyId: string } }>,
  reply: FastifyReply,
) {
  const result = deleteAgency(request.params.agencyId);

  if ("error" in result) {
    return reply.code(result.statusCode).send({ message: result.error });
  }

  return reply.code(result.statusCode).send(result.data);
}
