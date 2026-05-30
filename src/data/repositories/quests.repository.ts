import type { QuestsRemoteDataSource } from "@/data/datasource/remote/quests.remote";
import {
	toQuest,
	toQuests,
	type Quest,
	type QuestInput,
} from "@/data/models/quests";

// The repository wraps the remote data source and validates every raw response
// into typed models via the `to*` parser functions. Mirrors currency.repository.ts.
export type QuestsRepository = {
	list: (guildId: string) => Promise<Array<Quest>>;
	create: (guildId: string, input: QuestInput) => Promise<Quest>;
	update: (
		guildId: string,
		questId: string,
		input: QuestInput
	) => Promise<Quest>;
	remove: (guildId: string, questId: string) => Promise<void>;
};

export const makeQuestsRepository = (
	remote: QuestsRemoteDataSource
): QuestsRepository => ({
	// Parse the raw array through the Quest schema.
	list: async (guildId) => toQuests(await remote.list(guildId)),

	// Parse the newly created quest returned by the backend.
	create: async (guildId, input) => toQuest(await remote.create(guildId, input)),

	// Parse the updated quest returned by the backend.
	update: async (guildId, questId, input) =>
		toQuest(await remote.update(guildId, questId, input)),

	// DELETE returns no meaningful body; just await the side-effect.
	remove: async (guildId, questId) => remote.remove(guildId, questId),
});
