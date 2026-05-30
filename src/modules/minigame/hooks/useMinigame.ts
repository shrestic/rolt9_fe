import {
	useMutation,
	useQuery,
	useQueryClient,
	type UseMutationResult,
	type UseQueryResult,
} from "@tanstack/react-query";
import { useMinigameRepository } from "@/di/RepositoriesProvider";
import type {
	MinigameSettings,
	MinigameSettingsInput,
} from "@/data/models/minigame";

// Reads the guild's mini-games settings (briefly cached).
export const useMinigameSettings = (
	guildId: string
): UseQueryResult<MinigameSettings> => {
	const repo = useMinigameRepository();
	return useQuery({
		queryKey: ["minigame-settings", guildId],
		queryFn: () => repo.getSettings(guildId),
		staleTime: 30 * 1000,
	});
};

// Persists settings; primes the cache with the server response on success.
export const useUpdateMinigameSettings = (
	guildId: string
): UseMutationResult<MinigameSettings, Error, MinigameSettingsInput> => {
	const repo = useMinigameRepository();
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (input: MinigameSettingsInput) =>
			repo.updateSettings(guildId, input),
		onSuccess: (data) => qc.setQueryData(["minigame-settings", guildId], data),
	});
};
