import { agencies } from "../../database/in-memory-db";

export function listActiveAgencies() {
  const activeAgencies = agencies.filter((item) => !item.deletedAt);

  return {
    data: activeAgencies,
    statusCode: 200 as const,
  };
}
