import { agencies } from "../../database/in-memory-db";

type UpdateAgencyInput = {
  agencyId: string;
  name: string;
};

export function updateAgency(input: UpdateAgencyInput) {
  const { agencyId, name } = input;

  const agency = agencies.find((item) => item.id === agencyId);
  if (!agency || agency.deletedAt) {
    return { error: "Agencia nao encontrada.", statusCode: 404 as const };
  }

  agency.name = name;
  agency.updatedAt = new Date().toISOString();

  return {
    data: agency,
    statusCode: 200 as const,
  };
}
