import { FastifyReply, FastifyRequest } from "fastify";
import { createForm } from "../../core/use-cases/create-form";
import { decideFormBudget } from "../../core/use-cases/decide-form-budget";
import { deleteForm } from "../../core/use-cases/delete-form";
import { listAgencyForms } from "../../core/use-cases/list-agency-forms";
import { listClientForms } from "../../core/use-cases/list-client-forms";
import { setFormBudget } from "../../core/use-cases/set-form-budget";
import { updateFormStatus } from "../../core/use-cases/update-form-status";
import { respondForm } from "../../core/use-cases/respond-form";
import { getClientForm } from "../../core/use-cases/get-client-form";
import { deliverForm, type DeliverFormFile } from "../../core/use-cases/deliver-form";
import { getFormDeliveryFile } from "../../core/use-cases/get-form-delivery-file";
import { getAuthUser } from "../middlewares/get-auth-user";

export async function createFormController(
  request: FastifyRequest<{
    Body: {
      agencyId: string;
      description: string;
      colors?: Array<{ name: string; hexCode: string }>;
    };
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
    colors: request.body.colors,
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

export async function getClientFormController(
  request: FastifyRequest<{ Params: { formId: string } }>,
  reply: FastifyReply,
) {
  const user = getAuthUser(request);
  if (!user) {
    return reply.code(401).send({ message: "Token invalido ou ausente." });
  }

  const result = await getClientForm({
    formId: request.params.formId,
    clientId: user.id,
  });

  if ("error" in result) {
    return reply.code(result.statusCode).send({ message: result.error });
  }

  return reply.code(result.statusCode).send(result.data);
}

export async function downloadFormDeliveryFileController(
  request: FastifyRequest<{ Params: { formId: string } }>,
  reply: FastifyReply,
) {
  const user = getAuthUser(request);
  if (!user) {
    return reply.code(401).send({ message: "Token invalido ou ausente." });
  }

  const result = await getFormDeliveryFile({
    formId: request.params.formId,
    clientId: user.id,
  });

  if ("error" in result) {
    return reply.code(result.statusCode).send({ message: result.error });
  }

  const { buffer, mimeType, downloadName } = result.data;
  const safeName = downloadName.replace(/[^\w.\-()\s\u00C0-\u024F]+/g, "_");

  return reply
    .code(200)
    .header("Content-Type", mimeType)
    .header(
      "Content-Disposition",
      `attachment; filename="${safeName}"; filename*=UTF-8''${encodeURIComponent(downloadName)}`,
    )
    .send(buffer);
}

export async function deliverFormController(
  request: FastifyRequest<{ Params: { formId: string } }>,
  reply: FastifyReply,
) {
  const user = getAuthUser(request);
  if (!user || !user.agencyId) {
    return reply.code(403).send({ message: "Usuario sem agencia vinculada." });
  }

  let file: DeliverFormFile | undefined;
  let deliveryMessage: string | undefined;

  try {
    const parts = request.parts();
    for await (const part of parts) {
      if (part.type === "file") {
        const buffer = await part.toBuffer();
        file = {
          buffer,
          filename: part.filename,
          mimetype: part.mimetype,
        };
      } else if (part.fieldname === "deliveryMessage") {
        deliveryMessage = String(part.value);
      }
    }
  } catch {
    return reply.code(400).send({ message: "Erro ao processar o upload." });
  }

  const result = await deliverForm({
    formId: request.params.formId,
    agencyId: user.agencyId,
    file,
    deliveryMessage,
  });

  if ("error" in result) {
    return reply.code(result.statusCode).send({ message: result.error });
  }

  return reply.code(result.statusCode).send(result.data);
}

export async function setFormBudgetController(
  request: FastifyRequest<{
    Params: { formId: string };
    Body: { budgetValue: string; budgetMessage?: string };
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
    budgetMessage: request.body.budgetMessage,
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

export async function respondFormController(
  request: FastifyRequest<{
    Params: { formId: string };
    Body: { feedback: string };
  }>,
  reply: FastifyReply,
) {
  const user = getAuthUser(request);
  if (!user || !user.agencyId) {
    return reply.code(403).send({ message: "Usuario sem agencia vinculada." });
  }

  const result = await respondForm({
    formId: request.params.formId,
    agencyId: user.agencyId,
    feedback: request.body.feedback,
  });

  if ("error" in result) {
    return reply.code(result.statusCode).send({ message: result.error });
  }

  return reply.code(result.statusCode).send(result.data);
}
