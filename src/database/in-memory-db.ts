import { hashSync } from "bcryptjs";
import { randomUUID } from "node:crypto";
import { AgencyRecord, UserRecord } from "../core/types/records";

export const users: UserRecord[] = [
  {
    id: randomUUID(),
    name: "Super Admin",
    email: process.env.SUPERADMIN_EMAIL ?? "superadmin@agency.local",
    passwordHash: hashSync(process.env.SUPERADMIN_PASSWORD ?? "admin123", 10),
    role: "SUPERADMIN",
  },
];

export const agencies: AgencyRecord[] = [];
