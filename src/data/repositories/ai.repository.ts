import type { AiRemoteDataSource } from "@/data/datasource/remote/ai.remote";
import {
	toAiSettings,
	type AiSettings,
	type AiSettingsInput,
} from "@/data/models/ai";

// Wraps the remote, parsing every raw response into a validated typed model.
export type AiRepository = {
	getSettings: (guildId: string) => Promise<AiSettings>;
	updateSettings: (
		guildId: string,
		input: AiSettingsInput
	) => Promise<AiSettings>;
};

export const makeAiRepository = (remote: AiRemoteDataSource): AiRepository => ({
	getSettings: async (guildId) => toAiSettings(await remote.getSettings(guildId)),
	updateSettings: async (guildId, input) =>
		toAiSettings(await remote.updateSettings(guildId, input)),
});
