import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { useLevelingRepository } from "@/di/RepositoriesProvider";
import type { LeaderboardPage } from "@/data/models/leveling";

export const useLeaderboard = (
	guildId: string,
	parameters: { page?: number; pageSize?: number }
): UseQueryResult<LeaderboardPage> => {
	const repo = useLevelingRepository();
	return useQuery({
		queryKey: [
			"leveling-leaderboard",
			guildId,
			parameters.page,
			parameters.pageSize,
		],
		queryFn: () => repo.getLeaderboard(guildId, parameters),
		staleTime: 15 * 1000,
	});
};
