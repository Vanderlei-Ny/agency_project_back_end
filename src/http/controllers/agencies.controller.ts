import { FastifyReply, FastifyRequest } from "fastify";
import { listActiveAgencies } from "../../core/use-cases/list-active-agencies";
import { createUserAgency } from "../../core/use-cases/create-user-agency";
import { updateAgency } from "../../core/use-cases/update-agency";
import { addAgencyMember } from "../../core/use-cases/add-agency-member";
import { getAuthUser } from "../middlewares/get-auth-user";
import { prisma } from "../../database/prisma";

export async function listAgenciesController(
  _request: FastifyRequest,
  reply: FastifyReply,
) {
  const result = await listActiveAgencies();
  return reply.code(result.statusCode).send(result.data);
}

export async function createAgencyController(
  request: FastifyRequest<{
    Body: {
      name: string;
      description?: string;
      phone?: string;
      iconAgency?: string;
    };
  }>,
  reply: FastifyReply,
) {
  const user = getAuthUser(request);
  if (!user) {
    return reply.code(401).send({ message: "Token invalido ou ausente." });
  }

  const result = await createUserAgency({
    userId: user.id,
    agencyName: request.body.name,
    description: request.body.description,
    phone: request.body.phone,
    iconAgency: request.body.iconAgency,
  });

  if ("error" in result) {
    return reply.code(result.statusCode).send({ message: result.error });
  }

  const freshUser = await prisma.user.findUnique({ where: { id: user.id } });
  if (!freshUser) {
    return reply.code(500).send({ message: "Erro ao atualizar sessão." });
  }

  const token = request.server.jwt.sign({
    id: freshUser.id,
    email: freshUser.email,
    role: freshUser.role,
    agencyId: freshUser.agencyId ?? undefined,
  });

  return reply.code(result.statusCode).send({ ...result.data, token });
}

export async function getMyAgencyController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const user = getAuthUser(request);
  if (!user || !user.agencyId) {
    return reply.code(403).send({ message: "Usuario sem agencia vinculada." });
  }

  try {
    const agency = await prisma.agency.findUnique({
      where: { id: user.agencyId },
    });

    if (!agency) {
      return reply.code(404).send({ message: "Agencia nao encontrada." });
    }

    return reply.code(200).send(agency);
  } catch (error) {
    console.error("Erro ao buscar agência:", error);
    return reply.code(500).send({ message: "Erro ao buscar agência." });
  }
}

export async function updateMyAgencyController(
  request: FastifyRequest<{
    Body: {
      name?: string;
      description?: string | null;
      phone?: string | null;
      iconAgency?: string;
    };
  }>,
  reply: FastifyReply,
) {
  const user = getAuthUser(request);
  if (!user || !user.agencyId) {
    return reply.code(403).send({ message: "Usuario sem agencia vinculada." });
  }

  const result = await updateAgency({
    agencyId: user.agencyId,
    name: request.body.name,
    description: request.body.description,
    phone: request.body.phone,
    iconAgency: request.body.iconAgency,
  });

  if ("error" in result) {
    return reply.code(result.statusCode).send({ message: result.error });
  }

  return reply.code(result.statusCode).send(result.data);
}

export async function addAgencyMemberController(
  request: FastifyRequest<{
    Body: {
      name: string;
      email: string;
      password: string;
    };
  }>,
  reply: FastifyReply,
) {
  const user = getAuthUser(request);
  if (!user || !user.agencyId) {
    return reply.code(403).send({ message: "Usuario sem agencia vinculada." });
  }

  if (user.role !== "AGENCY_ADMIN" && user.role !== "SUPERADMIN") {
    return reply.code(403).send({ message: "Sem permissão para adicionar funcionários." });
  }

  const result = await addAgencyMember({
    agencyId: user.agencyId,
    name: request.body.name,
    email: request.body.email,
    password: request.body.password,
  });

  if ("error" in result) {
    return reply.code(result.statusCode).send({ message: result.error });
  }

  return reply.code(result.statusCode).send(result.data);
}
