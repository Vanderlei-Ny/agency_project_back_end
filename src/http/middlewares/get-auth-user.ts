import { FastifyRequest } from "fastify";
import { JwtUser } from "../../core/types/auth";

function isJwtUser(value: unknown): value is JwtUser {
  if (!value || typeof value !== "object") {
    return false;
  }

  const payload = value as Record<string, unknown>;

  return (
    typeof payload.id === "string" &&
    typeof payload.email === "string" &&
    typeof payload.role === "string" &&
    (payload.agencyId === undefined ||
      payload.agencyId === null ||
      typeof payload.agencyId === "string")
  );
}

export function getAuthUser(request: FastifyRequest): JwtUser | null {
  const user = request.user;

  if (!isJwtUser(user)) {
    return null;
  }

  return user;
}
