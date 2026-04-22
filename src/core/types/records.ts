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
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
};

export type FormStatus =
  | "PENDING_BUDGET"
  | "BUDGET_SENT"
  | "APPROVED"
  | "REJECTED"
  | "IN_PROGRESS"
  | "DELIVERED";

export type FormRecord = {
  id: string;
  agencyId: string;
  clientId: string;
  description: string;
  paymentMethod?: string;
  budgetValue?: string;
  rejectionReason?: string;
  status: FormStatus;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
};
