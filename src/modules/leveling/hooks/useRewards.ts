import {
	useMutation,
	useQuery,
	useQueryClient,
	type UseMutationResult,
	type UseQueryResult,
} from "@tanstack/react-query";
import { useLevelingRepository } from "@/di/RepositoriesProvider";
import type { LevelReward, LevelRewardInput } from "@/data/models/leveling";

export const useRewards = (
	guildId: string
): UseQueryResult<Array<LevelReward>> => {
	const repo = useLevelingRepository();
	return useQuery({
		queryKey: ["leveling-rewards", guildId],
		queryFn: () => repo.getRewards(guildId),
		staleTime: 30 * 1000,
	});
};

export const useCreateReward = (
	guildId: string
): UseMutationResult<LevelReward, Error, LevelRewardInput> => {
	const repo = useLevelingRepository();
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (input: LevelRewardInput) => repo.createReward(guildId, input),
		onSuccess: () => {
			void qc.invalidateQueries({ queryKey: ["leveling-rewards", guildId] });
		},
	});
};

export const useDeleteReward = (
	guildId: string
): UseMutationResult<unknown, Error, number> => {
	const repo = useLevelingRepository();
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (level: number) => repo.deleteReward(guildId, level),
		onSuccess: () => {
			void qc.invalidateQueries({ queryKey: ["leveling-rewards", guildId] });
		},
	});
};
