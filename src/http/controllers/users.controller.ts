import { FastifyReply, FastifyRequest } from "fastify";
import { getCurrentUser } from "../../core/use-cases/get-current-user";
import { listAgencyMembers } from "../../core/use-cases/list-agency-members";
import { createAgencyUser } from "../../core/use-cases/create-agency-user";
import { getAuthUser } from "../middlewares/get-auth-user";
import { prisma } from "../../database/prisma";

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
    return reply.code(result.statusCode ?? 500).send({ message: result.error });
  }

  return reply.send(result.data);
}

export async function listAgencyMembersController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const user = getAuthUser(request);

  if (!user) {
    return reply.code(401).send({ message: "Token invalido ou ausente." });
  }

  const result = await listAgencyMembers(user.id);

  if ("error" in result) {
    return reply.code(result.statusCode ?? 500).send({ message: result.error });
  }

  return reply.send(result.data);
}

export async function createAgencyMemberController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const authUser = getAuthUser(request);

  if (!authUser) {
    return reply.code(401).send({ message: "Token invalido ou ausente." });
  }

  const { name, email, password } = request.body as any;

  // Descobre a agência do usuário logado (gerente)
  const admin = await prisma.user.findUnique({
    where: { id: authUser.id },
    select: { agencyId: true }
  });

  if (!admin || !admin.agencyId) {
    return reply.code(403).send({ message: "Usuario logado nao possui agencia vinculada." });
  }

  const result = await createAgencyUser({
    agencyId: admin.agencyId,
    name,
    email,
    password,
    role: "AGENCY_MEMBER"
  });

  if ("error" in result) {
    return reply.code(result.statusCode ?? 500).send({ message: result.error });
  }

  return reply.code(201).send(result.data);
}