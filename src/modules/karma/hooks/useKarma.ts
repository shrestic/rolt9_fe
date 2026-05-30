import {
	useMutation,
	useQuery,
	useQueryClient,
	type UseMutationResult,
	type UseQueryResult,
} from "@tanstack/react-query";
import { useKarmaRepository } from "@/di/RepositoriesProvider";
import type {
	KarmaLeaderboardPage,
	KarmaSettings,
	KarmaSettingsInput,
} from "@/data/models/karma";

// Reads the guild's karma settings. Cached briefly so navigating back and
// forth between tabs doesn't re-fetch on every mount.
export const useKarmaSettings = (
	guildId: string
): UseQueryResult<KarmaSettings> => {
	const repo = useKarmaRepository();
	return useQuery({
		queryKey: ["karma-settings", guildId],
		queryFn: () => repo.getSettings(guildId),
		staleTime: 30 * 1000,
	});
};

// Persists settings changes. On success we prime the query cache with the
// server's response so the UI reflects the saved state immediately.
export const useUpdateKarmaSettings = (
	guildId: string
): UseMutationResult<KarmaSettings, Error, KarmaSettingsInput> => {
	const repo = useKarmaRepository();
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (input: KarmaSettingsInput) =>
			repo.updateSettings(guildId, input),
		onSuccess: (data) => qc.setQueryData(["karma-settings", guildId], data),
	});
};

// Reads one page of the top-karma-members leaderboard. The page/pageSize are
// part of the query key so each page is cached independently.
export const useKarmaLeaderboard = (
	guildId: string,
	parameters: { page?: number; pageSize?: number }
): UseQueryResult<KarmaLeaderboardPage> => {
	const repo = useKarmaRepository();
	return useQuery({
		queryKey: [
			"karma-leaderboard",
			guildId,
			parameters.page,
			parameters.pageSize,
		],
		queryFn: () => repo.getLeaderboard(guildId, parameters),
		staleTime: 15 * 1000,
	});
};
