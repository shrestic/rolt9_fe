import {
	useMutation,
	useQuery,
	useQueryClient,
	type UseMutationResult,
	type UseQueryResult,
} from "@tanstack/react-query";
import { useWelcomeRepository } from "@/di/RepositoriesProvider";
import type {
	WelcomeSettings,
	WelcomeSettingsInput,
} from "@/data/models/welcome";

export const useWelcomeSettings = (
	guildId: string
): UseQueryResult<WelcomeSettings> => {
	const repo = useWelcomeRepository();
	return useQuery({
		queryKey: ["welcome-settings", guildId],
		queryFn: () => repo.getSettings(guildId),
		staleTime: 30 * 1000,
	});
};

export const useUpdateWelcomeSettings = (
	guildId: string
): UseMutationResult<WelcomeSettings, Error, WelcomeSettingsInput> => {
	const repo = useWelcomeRepository();
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (input: WelcomeSettingsInput) =>
			repo.updateSettings(guildId, input),
		onSuccess: (data) =>
			qc.setQueryData(["welcome-settings", guildId], data),
	});
};
