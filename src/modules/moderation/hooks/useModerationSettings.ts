import {
	useMutation,
	useQuery,
	useQueryClient,
	type UseMutationResult,
	type UseQueryResult,
} from "@tanstack/react-query";
import { useModerationRepository } from "@/di/RepositoriesProvider";
import type {
	ModerationSettings,
	ModerationSettingsInput,
} from "@/data/models/moderation";

export const useModerationSettings = (
	guildId: string
): UseQueryResult<ModerationSettings> => {
	const repo = useModerationRepository();
	return useQuery({
		queryKey: ["moderation-settings", guildId],
		queryFn: () => repo.getSettings(guildId),
		staleTime: 30 * 1000,
	});
};

export const useUpdateModerationSettings = (
	guildId: string
): UseMutationResult<ModerationSettings, Error, ModerationSettingsInput> => {
	const repo = useModerationRepository();
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (input: ModerationSettingsInput) => repo.updateSettings(guildId, input),
		onSuccess: (data) => qc.setQueryData(["moderation-settings", guildId], data),
	});
};
