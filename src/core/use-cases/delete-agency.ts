import { agencies } from "../../database/in-memory-db";

export function deleteAgency(agencyId: string) {
  const agency = agencies.find((item) => item.id === agencyId);
  if (!agency || agency.deletedAt) {
    return { error: "Agencia nao encontrada.", statusCode: 404 as const };
  }

  agency.deletedAt = new Date().toISOString();
  agency.updatedAt = agency.deletedAt;

  return {
    data: { id: agency.id, deletedAt: agency.deletedAt },
    statusCode: 200 as const,
  };
}
