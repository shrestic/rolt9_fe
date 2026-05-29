import {
	useMutation,
	useQuery,
	useQueryClient,
	type UseMutationResult,
	type UseQueryResult,
} from "@tanstack/react-query";
import { useLevelingRepository } from "@/di/RepositoriesProvider";
import type {
	LevelingSettings,
	LevelingSettingsInput,
} from "@/data/models/leveling";

export const useLevelingSettings = (
	guildId: string
): UseQueryResult<LevelingSettings> => {
	const repo = useLevelingRepository();
	return useQuery({
		queryKey: ["leveling-settings", guildId],
		queryFn: () => repo.getSettings(guildId),
		staleTime: 30 * 1000,
	});
};

export const useUpdateLevelingSettings = (
	guildId: string
): UseMutationResult<LevelingSettings, Error, LevelingSettingsInput> => {
	const repo = useLevelingRepository();
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (input: LevelingSettingsInput) => repo.updateSettings(guildId, input),
		onSuccess: (data) => qc.setQueryData(["leveling-settings", guildId], data),
	});
};
