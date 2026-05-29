import {
	useMutation,
	useQuery,
	useQueryClient,
	type UseMutationResult,
	type UseQueryResult,
} from "@tanstack/react-query";
import { useCurrencyRepository } from "@/di/RepositoriesProvider";
import type {
	CurrencySettings,
	CurrencySettingsInput,
} from "@/data/models/currency";

// Reads the guild's currency settings. Cached briefly so navigating back and
// forth between tabs doesn't re-fetch on every mount.
export const useCurrencySettings = (
	guildId: string
): UseQueryResult<CurrencySettings> => {
	const repo = useCurrencyRepository();
	return useQuery({
		queryKey: ["currency-settings", guildId],
		queryFn: () => repo.getSettings(guildId),
		staleTime: 30 * 1000,
	});
};

// Persists settings changes. On success we prime the query cache with the
// server's response so the UI reflects the saved state immediately.
export const useUpdateCurrencySettings = (
	guildId: string
): UseMutationResult<CurrencySettings, Error, CurrencySettingsInput> => {
	const repo = useCurrencyRepository();
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (input: CurrencySettingsInput) =>
			repo.updateSettings(guildId, input),
		onSuccess: (data) => qc.setQueryData(["currency-settings", guildId], data),
	});
};
