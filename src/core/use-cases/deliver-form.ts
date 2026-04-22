import { randomUUID } from "crypto";
import fs from "fs/promises";
import path from "path";
import { prisma } from "../../database/prisma";

const ALLOWED_MIME = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

const MIME_TO_EXT: Record<string, string> = {
  "application/pdf": ".pdf",
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
};

function deliveriesDir() {
  return path.join(process.cwd(), "uploads", "deliveries");
}

export type DeliverFormFile = {
  buffer: Buffer;
  filename: string;
  mimetype: string;
};

type DeliverFormInput = {
  formId: string;
  agencyId: string;
  file?: DeliverFormFile;
  deliveryMessage?: string | null;
};

export async function deliverForm(input: DeliverFormInput) {
  const { formId, agencyId, file, deliveryMessage } = input;

  const form = await prisma.form.findFirst({
    where: { id: formId, agencyId, deletedAt: null },
  });

  if (!form) {
    return { error: "Formulario nao encontrado.", statusCode: 404 as const };
  }

  if (form.status !== "IN_PROGRESS") {
    return {
      error:
        "Somente solicitacoes em execucao podem receber entrega final. Use Iniciar projeto antes.",
      statusCode: 400 as const,
    };
  }

  let deliveryStoredName: string | null = null;
  let deliveryFileName: string | null = null;
  let deliveryMimeType: string | null = null;

  if (file) {
    if (!ALLOWED_MIME.has(file.mimetype)) {
      return {
        error:
          "Tipo de arquivo nao permitido. Use PDF, JPG, PNG, WebP ou GIF.",
        statusCode: 400 as const,
      };
    }

    const fromMime = MIME_TO_EXT[file.mimetype];
    const fromName = path.extname(file.filename).toLowerCase();
    const allowedExt = new Set([
      ".pdf",
      ".jpg",
      ".jpeg",
      ".png",
      ".webp",
      ".gif",
    ]);
    const normalizedNameExt =
      fromName === ".jpeg" ? ".jpg" : fromName;
    const ext =
      fromMime ??
      (allowedExt.has(normalizedNameExt) ? normalizedNameExt : null);
    if (!ext) {
      return {
        error: "Extensao do arquivo invalida.",
        statusCode: 400 as const,
      };
    }

    deliveryStoredName = `${randomUUID()}${ext}`;
    deliveryFileName = path.basename(file.filename).slice(0, 200) || "arquivo";
    deliveryMimeType = file.mimetype;

    const dir = deliveriesDir();
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(path.join(dir, deliveryStoredName), file.buffer);
  }

  const updated = await prisma.form.update({
    where: { id: formId },
    data: {
      status: "DELIVERED",
      deliveryStoredName,
      deliveryFileName,
      deliveryMimeType,
      deliveryMessage:
        deliveryMessage === undefined || deliveryMessage === null
          ? null
          : deliveryMessage.trim() || null,
    },
    include: {
      client: {
        select: { id: true, name: true, email: true },
      },
      agency: {
        select: { id: true, name: true },
      },
      colors: true,
    },
  });

  return {
    data: updated,
    statusCode: 200 as const,
  };
}
