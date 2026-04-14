import { hashSync } from "bcryptjs";
import { prisma } from "../../database/prisma";

export async function ensureSuperadmin() {
  const email = process.env.SUPERADMIN_EMAIL ?? "superadmin@agency.local";
  const password = process.env.SUPERADMIN_PASSWORD ?? "admin123";

  await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      name: "Super Admin",
      email,
      passwordHash: hashSync(password, 10),
      role: "SUPERADMIN",
    },
  });
}
