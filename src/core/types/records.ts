import { Role } from "./auth";

export type UserRecord = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: Role;
  agencyId?: string;
};

export type AgencyRecord = {
  id: string;
  name: string;
};
