import { objectToSnake } from "ts-case-convert";
import { http } from "@/utils/http";
import { endpoints } from "@/settings/endpoints";
import type { WelcomeSettingsInput } from "@/data/models/welcome";

export type WelcomeRemoteDataSource = {
	getSettings: (guildId: string) => Promise<unknown>;
	updateSettings: (
		guildId: string,
		input: WelcomeSettingsInput
	) => Promise<unknown>;
};

export const makeWelcomeRemote = (client = http): WelcomeRemoteDataSource => ({
	getSettings: async (guildId) =>
		(await client.get(endpoints.welcomeSettings(guildId))).data as unknown,
	updateSettings: async (guildId, input) =>
		(await client.put(endpoints.welcomeSettings(guildId), objectToSnake(input)))
			.data as unknown,
});
