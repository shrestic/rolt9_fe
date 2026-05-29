import {
	useMutation,
	useQuery,
	useQueryClient,
	type UseMutationResult,
	type UseQueryResult,
} from "@tanstack/react-query";
import { useLevelingRepository } from "@/di/RepositoriesProvider";
import type {
	RankCardTheme,
	RankCardThemeInput,
} from "@/data/models/leveling";

export const useRankCardTheme = (
	guildId: string
): UseQueryResult<RankCardTheme> => {
	const repo = useLevelingRepository();
	return useQuery({
		queryKey: ["leveling-theme", guildId],
		queryFn: () => repo.getTheme(guildId),
		staleTime: 30 * 1000,
	});
};

export const useUpdateRankCardTheme = (
	guildId: string
): UseMutationResult<RankCardTheme, Error, RankCardThemeInput> => {
	const repo = useLevelingRepository();
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (input: RankCardThemeInput) => repo.updateTheme(guildId, input),
		onSuccess: (data) => qc.setQueryData(["leveling-theme", guildId], data),
	});
};
