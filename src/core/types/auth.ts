export type Role = "SUPERADMIN" | "AGENCY_ADMIN" | "AGENCY_MEMBER" | "CLIENT";

export type JwtUser = {
  id: string;
  email: string;
  role: Role;
};
