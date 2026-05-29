import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { useBadgeRepository } from "@/di/RepositoriesProvider";
import type { BadgeCatalogEntry } from "@/data/models/badges";

// Fetches the guild's badge catalog. `staleTime: Infinity` because the catalog
// is static server configuration — it never changes during a session, so we
// only fetch once and never re-request in the background.
export const useBadgeCatalog = (
	guildId: string
): UseQueryResult<Array<BadgeCatalogEntry>> => {
	const repo = useBadgeRepository();
	return useQuery({
		queryKey: ["badge-catalog", guildId],
		queryFn: () => repo.getCatalog(guildId),
		staleTime: Infinity,
	});
};
