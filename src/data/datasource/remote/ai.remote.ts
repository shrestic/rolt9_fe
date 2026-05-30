import { objectToSnake } from "ts-case-convert";
import { http } from "@/utils/http";
import { endpoints } from "@/settings/endpoints";
import type { AiSettingsInput } from "@/data/models/ai";

// Raw `unknown` payloads; the repository validates/parses them.
export type AiRemoteDataSource = {
	getSettings: (guildId: string) => Promise<unknown>;
	updateSettings: (guildId: string, input: AiSettingsInput) => Promise<unknown>;
};

export const makeAiRemote = (client = http): AiRemoteDataSource => ({
	getSettings: async (guildId) =>
		(await client.get(endpoints.aiSettings(guildId))).data as unknown,
	updateSettings: async (guildId, input) =>
		(await client.put(endpoints.aiSettings(guildId), objectToSnake(input)))
			.data as unknown,
});
