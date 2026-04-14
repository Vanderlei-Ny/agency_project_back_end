import { FastifyReply, FastifyRequest } from "fastify";
import { createForm } from "../../core/use-cases/create-form";
import { decideFormBudget } from "../../core/use-cases/decide-form-budget";
import { deleteForm } from "../../core/use-cases/delete-form";
import { listAgencyForms } from "../../core/use-cases/list-agency-forms";
import { listClientForms } from "../../core/use-cases/list-client-forms";
import { setFormBudget } from "../../core/use-cases/set-form-budget";
import { updateFormStatus } from "../../core/use-cases/update-form-status";
import { getAuthUser } from "../middlewares/get-auth-user";

export async function createFormController(
  request: FastifyRequest<{
    Body: { agencyId: string; description: string };
  }>,
  reply: FastifyReply,
) {
  const user = getAuthUser(request);
  if (!user) {
    return reply.code(401).send({ message: "Token invalido ou ausente." });
  }

  const result = await createForm({
    clientId: user.id,
    agencyId: request.body.agencyId,
    description: request.body.description,
  });

  if ("error" in result) {
    return reply.code(result.statusCode).send({ message: result.error });
  }

  return reply.code(result.statusCode).send(result.data);
}

export async function listAgencyFormsController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const user = getAuthUser(request);
  if (!user || !user.agencyId) {
    return reply.code(403).send({ message: "Usuario sem agencia vinculada." });
  }

  const result = await listAgencyForms({ agencyId: user.agencyId });
  return reply.code(result.statusCode).send(result.data);
}

export async function listClientFormsController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const user = getAuthUser(request);
  if (!user) {
    return reply.code(401).send({ message: "Token invalido ou ausente." });
  }

  const result = await listClientForms({ clientId: user.id });
  return reply.code(result.statusCode).send(result.data);
}

export async function setFormBudgetController(
  request: FastifyRequest<{
    Params: { formId: string };
    Body: { budgetValue: string };
  }>,
  reply: FastifyReply,
) {
  const user = getAuthUser(request);
  if (!user || !user.agencyId) {
    return reply.code(403).send({ message: "Usuario sem agencia vinculada." });
  }

  const result = await setFormBudget({
    formId: request.params.formId,
    agencyId: user.agencyId,
    budgetValue: request.body.budgetValue,
  });

  if ("error" in result) {
    return reply.code(result.statusCode).send({ message: result.error });
  }

  return reply.code(result.statusCode).send(result.data);
}

export async function decideFormBudgetController(
  request: FastifyRequest<{
    Params: { formId: string };
    Body: {
      approved: boolean;
      paymentMethod?: string;
      rejectionReason?: string;
    };
  }>,
  reply: FastifyReply,
) {
  const user = getAuthUser(request);
  if (!user) {
    return reply.code(401).send({ message: "Token invalido ou ausente." });
  }

  const result = await decideFormBudget({
    formId: request.params.formId,
    clientId: user.id,
    approved: request.body.approved,
    paymentMethod: request.body.paymentMethod,
    rejectionReason: request.body.rejectionReason,
  });

  if ("error" in result) {
    return reply.code(result.statusCode).send({ message: result.error });
  }

  return reply.code(result.statusCode).send(result.data);
}

export async function updateFormStatusController(
  request: FastifyRequest<{
    Params: { formId: string };
    Body: { status: "IN_PROGRESS" | "DELIVERED" };
  }>,
  reply: FastifyReply,
) {
  const user = getAuthUser(request);
  if (!user || !user.agencyId) {
    return reply.code(403).send({ message: "Usuario sem agencia vinculada." });
  }

  const result = await updateFormStatus({
    formId: request.params.formId,
    agencyId: user.agencyId,
    status: request.body.status,
  });

  if ("error" in result) {
    return reply.code(result.statusCode).send({ message: result.error });
  }

  return reply.code(result.statusCode).send(result.data);
}

export async function deleteFormController(
  request: FastifyRequest<{ Params: { formId: string } }>,
  reply: FastifyReply,
) {
  const user = getAuthUser(request);
  if (!user) {
    return reply.code(401).send({ message: "Token invalido ou ausente." });
  }

  const result = await deleteForm({
    formId: request.params.formId,
    clientId: user.id,
  });

  if ("error" in result) {
    return reply.code(result.statusCode).send({ message: result.error });
  }

  return reply.code(result.statusCode).send(result.data);
}
