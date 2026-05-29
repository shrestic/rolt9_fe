import {
	useMutation,
	useQueryClient,
	type UseMutationResult,
} from "@tanstack/react-query";
import { useLevelingRepository } from "@/di/RepositoriesProvider";
import type { MemberXp } from "@/data/models/leveling";

export const useUpdateMember = (
	guildId: string
): UseMutationResult<MemberXp, Error, { userId: string; totalXp: number }> => {
	const repo = useLevelingRepository();
	const qc = useQueryClient();
	return useMutation({
		mutationFn: ({ userId, totalXp }) =>
			repo.updateMember(guildId, userId, { totalXp }),
		onSuccess: () => {
			void qc.invalidateQueries({
				queryKey: ["leveling-leaderboard", guildId],
			});
		},
	});
};

export const useResetMember = (
	guildId: string
): UseMutationResult<unknown, Error, string> => {
	const repo = useLevelingRepository();
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (userId: string) => repo.resetMember(guildId, userId),
		onSuccess: () => {
			void qc.invalidateQueries({
				queryKey: ["leveling-leaderboard", guildId],
			});
		},
	});
};
