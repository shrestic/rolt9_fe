import {
	useMutation,
	useQuery,
	useQueryClient,
	type UseMutationResult,
	type UseQueryResult,
} from "@tanstack/react-query";
import { useBadgeRepository } from "@/di/RepositoriesProvider";
import type {
	BadgeSettings,
	BadgeSettingsInput,
} from "@/data/models/badges";

// Reads the guild's badge settings. Brief stale time so navigating between
// tabs doesn't re-fetch on every mount (mirrors useCurrencySettings).
export const useBadgeSettings = (
	guildId: string
): UseQueryResult<BadgeSettings> => {
	const repo = useBadgeRepository();
	return useQuery({
		queryKey: ["badge-settings", guildId],
		queryFn: () => repo.getSettings(guildId),
		staleTime: 30 * 1000,
	});
};

// Persists the enabled toggle. On success the query cache is primed with the
// server's response so the UI reflects saved state immediately.
export const useUpdateBadgeSettings = (
	guildId: string
): UseMutationResult<BadgeSettings, Error, BadgeSettingsInput> => {
	const repo = useBadgeRepository();
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (input: BadgeSettingsInput) =>
			repo.updateSettings(guildId, input),
		onSuccess: (data) => qc.setQueryData(["badge-settings", guildId], data),
	});
};
