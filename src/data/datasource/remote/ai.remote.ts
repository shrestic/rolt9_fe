import { objectToSnake } from "ts-case-convert";
import { http } from "@/utils/http";
import { endpoints } from "@/settings/endpoints";
import type { AiSettingsInput, KbEntryInput } from "@/data/models/ai";

// Raw `unknown` payloads; the repository validates/parses them.
export type AiRemoteDataSource = {
	getSettings: (guildId: string) => Promise<unknown>;
	updateSettings: (guildId: string, input: AiSettingsInput) => Promise<unknown>;
	listKb: (guildId: string) => Promise<unknown>;
	createKb: (guildId: string, input: KbEntryInput) => Promise<unknown>;
	deleteKb: (guildId: string, entryId: string) => Promise<unknown>;
};

export const makeAiRemote = (client = http): AiRemoteDataSource => ({
	getSettings: async (guildId) =>
		(await client.get(endpoints.aiSettings(guildId))).data as unknown,
	updateSettings: async (guildId, input) =>
		(await client.put(endpoints.aiSettings(guildId), objectToSnake(input)))
			.data as unknown,
	listKb: async (guildId) =>
		(await client.get(endpoints.aiKb(guildId))).data as unknown,
	createKb: async (guildId, input) =>
		(await client.post(endpoints.aiKb(guildId), objectToSnake(input)))
			.data as unknown,
	deleteKb: async (guildId, entryId) =>
		(await client.delete(endpoints.aiKbEntry(guildId, entryId))).data as unknown,
});
