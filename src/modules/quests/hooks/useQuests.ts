import {
	useMutation,
	useQuery,
	useQueryClient,
	type UseMutationResult,
	type UseQueryResult,
} from "@tanstack/react-query";
import { useQuestsRepository } from "@/di/RepositoriesProvider";
import type { Quest, QuestInput } from "@/data/models/quests";

// The React Query cache key for a guild's quest list.
const questsKey = (guildId: string) => ["quests", guildId] as const;

// ---------------------------------------------------------------------------
// Read — fetch the list of quests for a guild
// ---------------------------------------------------------------------------
// staleTime is short so the list re-validates in the background after mutations
// but avoids redundant network calls during quick tab switches.
export const useQuests = (guildId: string): UseQueryResult<Array<Quest>> => {
	const repo = useQuestsRepository();
	return useQuery({
		queryKey: questsKey(guildId),
		queryFn: () => repo.list(guildId),
		staleTime: 30 * 1000,
	});
};

// ---------------------------------------------------------------------------
// Create — POST a new quest and refresh the list on success
// ---------------------------------------------------------------------------
export const useCreateQuest = (
	guildId: string
): UseMutationResult<Quest, Error, QuestInput> => {
	const repo = useQuestsRepository();
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (input: QuestInput) => repo.create(guildId, input),
		// Invalidate the list so it re-fetches fresh data from the server.
		onSuccess: () => qc.invalidateQueries({ queryKey: questsKey(guildId) }),
	});
};

// ---------------------------------------------------------------------------
// Update — PATCH an existing quest by id and refresh the list on success
// ---------------------------------------------------------------------------
export const useUpdateQuest = (
	guildId: string
): UseMutationResult<Quest, Error, { questId: string; input: QuestInput }> => {
	const repo = useQuestsRepository();
	const qc = useQueryClient();
	return useMutation({
		mutationFn: ({ questId, input }) => repo.update(guildId, questId, input),
		onSuccess: () => qc.invalidateQueries({ queryKey: questsKey(guildId) }),
	});
};

// ---------------------------------------------------------------------------
// Delete — DELETE a quest by id and refresh the list on success
// ---------------------------------------------------------------------------
export const useDeleteQuest = (
	guildId: string
): UseMutationResult<void, Error, string> => {
	const repo = useQuestsRepository();
	const qc = useQueryClient();
	return useMutation({
		// The mutation variable is the questId string.
		mutationFn: (questId: string) => repo.remove(guildId, questId),
		onSuccess: () => qc.invalidateQueries({ queryKey: questsKey(guildId) }),
	});
};
