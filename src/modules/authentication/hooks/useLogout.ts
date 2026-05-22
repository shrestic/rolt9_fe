import {
	useMutation,
	useQueryClient,
	type UseMutationResult,
} from "@tanstack/react-query";
import { useAuthRepository } from "@/di/RepositoriesProvider";

export const useLogout = (): UseMutationResult<void, Error, void> => {
	const repo = useAuthRepository();
	const qc = useQueryClient();
	return useMutation({
		mutationFn: () => repo.logout(),
		onSuccess: () => {
			qc.removeQueries({ queryKey: ["me"] });
			window.location.assign("/");
		},
	});
};
