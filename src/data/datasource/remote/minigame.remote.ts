import { objectToSnake } from "ts-case-convert";
import { http } from "@/utils/http";
import { endpoints } from "@/settings/endpoints";
import type { MinigameSettingsInput } from "@/data/models/minigame";

// Raw `unknown` payloads; the repository validates/parses them. Mirrors the
// currency remote (settings-only here).
export type MinigameRemoteDataSource = {
	getSettings: (guildId: string) => Promise<unknown>;
	updateSettings: (
		guildId: string,
		input: MinigameSettingsInput
	) => Promise<unknown>;
};

export const makeMinigameRemote = (
	client = http
): MinigameRemoteDataSource => ({
	getSettings: async (guildId) =>
		(await client.get(endpoints.minigameSettings(guildId))).data as unknown,
	updateSettings: async (guildId, input) =>
		(
			await client.put(
				endpoints.minigameSettings(guildId),
				objectToSnake(input)
			)
		).data as unknown,
});
