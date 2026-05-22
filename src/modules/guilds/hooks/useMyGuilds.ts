import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { useGuildRepository } from "@/di/RepositoriesProvider";
import type { GuildSummary } from "@/data/models/guild";

export const useMyGuilds = (
	refetchInterval?: number
): UseQueryResult<Array<GuildSummary>> => {
	const repo = useGuildRepository();
	return useQuery({
		queryKey: ["my-guilds"],
		queryFn: () => repo.getMyGuilds(),
		staleTime: 30 * 1000,
		refetchInterval,
	});
};
