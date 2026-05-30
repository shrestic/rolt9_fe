import {
	useMutation,
	useQuery,
	useQueryClient,
	type UseMutationResult,
	type UseQueryResult,
} from "@tanstack/react-query";
import { useAiRepository } from "@/di/RepositoriesProvider";
import type { AiSettings, AiSettingsInput } from "@/data/models/ai";

// Reads the guild's AI settings (+ this month's usage). Briefly cached.
export const useAiSettings = (guildId: string): UseQueryResult<AiSettings> => {
	const repo = useAiRepository();
	return useQuery({
		queryKey: ["ai-settings", guildId],
		queryFn: () => repo.getSettings(guildId),
		staleTime: 30 * 1000,
	});
};

// Persists settings; primes the cache with the server response on success.
export const useUpdateAiSettings = (
	guildId: string
): UseMutationResult<AiSettings, Error, AiSettingsInput> => {
	const repo = useAiRepository();
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (input: AiSettingsInput) => repo.updateSettings(guildId, input),
		onSuccess: (data) => qc.setQueryData(["ai-settings", guildId], data),
	});
};
