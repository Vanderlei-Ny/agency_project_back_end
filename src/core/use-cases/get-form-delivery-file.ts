import fs from "fs/promises";
import path from "path";
import { prisma } from "../../database/prisma";

type GetFormDeliveryFileInput = {
  formId: string;
  clientId: string;
};

export async function getFormDeliveryFile(input: GetFormDeliveryFileInput) {
  const form = await prisma.form.findFirst({
    where: {
      id: input.formId,
      clientId: input.clientId,
      deletedAt: null,
    },
  });

  if (!form) {
    return {
      error: "Solicitacao nao encontrada.",
      statusCode: 404 as const,
    };
  }

  if (form.status !== "DELIVERED") {
    return {
      error: "Arquivo de entrega indisponivel para este status.",
      statusCode: 400 as const,
    };
  }

  if (!form.deliveryStoredName) {
    return {
      error: "Nenhum arquivo foi anexado nesta entrega.",
      statusCode: 404 as const,
    };
  }

  const filePath = path.join(
    process.cwd(),
    "uploads",
    "deliveries",
    form.deliveryStoredName,
  );

  try {
    const buffer = await fs.readFile(filePath);
    return {
      statusCode: 200 as const,
      data: {
        buffer,
        mimeType: form.deliveryMimeType ?? "application/octet-stream",
        downloadName: form.deliveryFileName ?? "entrega",
      },
    };
  } catch {
    return {
      error: "Arquivo nao encontrado no servidor.",
      statusCode: 404 as const,
    };
  }
}
