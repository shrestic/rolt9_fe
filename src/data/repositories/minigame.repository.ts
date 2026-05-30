import type { MinigameRemoteDataSource } from "@/data/datasource/remote/minigame.remote";
import {
	toMinigameSettings,
	type MinigameSettings,
	type MinigameSettingsInput,
} from "@/data/models/minigame";

// Wraps the remote, parsing every raw response into a validated typed model.
export type MinigameRepository = {
	getSettings: (guildId: string) => Promise<MinigameSettings>;
	updateSettings: (
		guildId: string,
		input: MinigameSettingsInput
	) => Promise<MinigameSettings>;
};

export const makeMinigameRepository = (
	remote: MinigameRemoteDataSource
): MinigameRepository => ({
	getSettings: async (guildId) =>
		toMinigameSettings(await remote.getSettings(guildId)),
	updateSettings: async (guildId, input) =>
		toMinigameSettings(await remote.updateSettings(guildId, input)),
});
