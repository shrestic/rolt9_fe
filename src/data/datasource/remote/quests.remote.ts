import { objectToSnake } from "ts-case-convert";
import { http } from "@/utils/http";
import { endpoints } from "@/settings/endpoints";
import type { QuestInput } from "@/data/models/quests";

// The remote data source returns raw `unknown` payloads; the repository layer
// is responsible for validating/parsing them into typed models. Mirrors the
// currency remote data source pattern.
export type QuestsRemoteDataSource = {
	list: (guildId: string) => Promise<unknown>;
	create: (guildId: string, input: QuestInput) => Promise<unknown>;
	update: (
		guildId: string,
		questId: string,
		input: QuestInput
	) => Promise<unknown>;
	remove: (guildId: string, questId: string) => Promise<void>;
};

export const makeQuestsRemote = (client = http): QuestsRemoteDataSource => ({
	// GET /guilds/{guildId}/quests → raw array of quests
	list: async (guildId) =>
		(await client.get(endpoints.quests(guildId))).data as unknown,

	// POST /guilds/{guildId}/quests — body is converted to snake_case for the API
	create: async (guildId, input) =>
		(
			await client.post(endpoints.quests(guildId), objectToSnake(input))
		).data as unknown,

	// PATCH /guilds/{guildId}/quests/{questId} — partial update in snake_case
	update: async (guildId, questId, input) =>
		(
			await client.patch(
				endpoints.quest(guildId, questId),
				objectToSnake(input)
			)
		).data as unknown,

	// DELETE /guilds/{guildId}/quests/{questId} → { ok: true } (ignored)
	remove: async (guildId, questId): Promise<void> => {
		await client.delete(endpoints.quest(guildId, questId));
	},
});
