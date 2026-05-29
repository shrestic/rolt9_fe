import {
	useMutation,
	useQueryClient,
	type UseMutationResult,
} from "@tanstack/react-query";
import { useCurrencyRepository } from "@/di/RepositoriesProvider";
import type { WalletMember } from "@/data/models/currency";

// Admin action: set a member's balance to an exact value (PATCH). On success we
// invalidate the leaderboard so the new balance/ordering is reflected.
export const useUpdateMember = (
	guildId: string
): UseMutationResult<
	WalletMember,
	Error,
	{ userId: string; balance: number }
> => {
	const repo = useCurrencyRepository();
	const qc = useQueryClient();
	return useMutation({
		mutationFn: ({ userId, balance }) =>
			repo.updateMember(guildId, userId, { balance }),
		onSuccess: () => {
			void qc.invalidateQueries({
				queryKey: ["currency-leaderboard", guildId],
			});
		},
	});
};

// Admin action: reset a member's balance to 0 (DELETE). Also refreshes the
// leaderboard on success.
export const useResetMember = (
	guildId: string
): UseMutationResult<WalletMember, Error, string> => {
	const repo = useCurrencyRepository();
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (userId: string) => repo.resetMember(guildId, userId),
		onSuccess: () => {
			void qc.invalidateQueries({
				queryKey: ["currency-leaderboard", guildId],
			});
		},
	});
};
