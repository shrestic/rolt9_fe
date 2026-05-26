import {
	useMutation,
	useQuery,
	useQueryClient,
	type UseMutationResult,
	type UseQueryResult,
} from "@tanstack/react-query";
import { useModerationRepository } from "@/di/RepositoriesProvider";
import type { ListCasesParameters } from "@/data/datasource/remote/moderation.remote";
import type { CasesPage } from "@/data/models/moderation";

export const useCases = (
	guildId: string,
	parameters: ListCasesParameters
): UseQueryResult<CasesPage> => {
	const repo = useModerationRepository();
	return useQuery({
		queryKey: ["cases", guildId, parameters],
		queryFn: () => repo.listCases(guildId, parameters),
		staleTime: 15 * 1000,
	});
};

export const useDeactivateCase = (
	guildId: string
): UseMutationResult<void, Error, number> => {
	const repo = useModerationRepository();
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (caseNumber: number) => repo.deactivateCase(guildId, caseNumber),
		onSuccess: () => qc.invalidateQueries({ queryKey: ["cases", guildId] }),
	});
};
