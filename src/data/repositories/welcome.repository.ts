import type { WelcomeRemoteDataSource } from "@/data/datasource/remote/welcome.remote";
import {
	toWelcomeSettings,
	type WelcomeSettings,
	type WelcomeSettingsInput,
} from "@/data/models/welcome";

export type WelcomeRepository = {
	getSettings: (guildId: string) => Promise<WelcomeSettings>;
	updateSettings: (
		guildId: string,
		input: WelcomeSettingsInput
	) => Promise<WelcomeSettings>;
};

export const makeWelcomeRepository = (
	remote: WelcomeRemoteDataSource
): WelcomeRepository => ({
	getSettings: async (guildId) =>
		toWelcomeSettings(await remote.getSettings(guildId)),
	updateSettings: async (guildId, input) =>
		toWelcomeSettings(await remote.updateSettings(guildId, input)),
});
