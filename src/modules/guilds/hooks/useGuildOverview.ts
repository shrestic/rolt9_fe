import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { useGuildRepository } from "@/di/RepositoriesProvider";
import type { GuildOverview } from "@/data/models/guild";

export const useGuildOverview = (
	guildId: string
): UseQueryResult<GuildOverview> => {
	const repo = useGuildRepository();
	return useQuery({
		queryKey: ["guild-overview", guildId],
		queryFn: () => repo.getOverview(guildId),
		staleTime: 30 * 1000,
		refetchOnWindowFocus: true,
	});
};
