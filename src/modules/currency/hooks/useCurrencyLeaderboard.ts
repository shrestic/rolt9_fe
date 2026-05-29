import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { useCurrencyRepository } from "@/di/RepositoriesProvider";
import type { WalletLeaderboardPage } from "@/data/models/currency";

// Reads one page of the richest-members leaderboard. The page/pageSize are
// part of the query key so each page is cached independently.
export const useCurrencyLeaderboard = (
	guildId: string,
	parameters: { page?: number; pageSize?: number }
): UseQueryResult<WalletLeaderboardPage> => {
	const repo = useCurrencyRepository();
	return useQuery({
		queryKey: [
			"currency-leaderboard",
			guildId,
			parameters.page,
			parameters.pageSize,
		],
		queryFn: () => repo.getLeaderboard(guildId, parameters),
		staleTime: 15 * 1000,
	});
};
