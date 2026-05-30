import type {
	KarmaLeaderboardParameters,
	KarmaRemoteDataSource,
} from "@/data/datasource/remote/karma.remote";
import {
	toKarmaLeaderboardPage,
	toKarmaSettings,
	type KarmaLeaderboardPage,
	type KarmaSettings,
	type KarmaSettingsInput,
} from "@/data/models/karma";

// The repository wraps the remote data source and turns every raw response
// into a validated, typed model via the `to*` parser functions. This mirrors
// the currency repository one-to-one.
export type KarmaRepository = {
	getSettings: (guildId: string) => Promise<KarmaSettings>;
	updateSettings: (
		guildId: string,
		input: KarmaSettingsInput
	) => Promise<KarmaSettings>;
	getLeaderboard: (
		guildId: string,
		parameters: KarmaLeaderboardParameters
	) => Promise<KarmaLeaderboardPage>;
};

export const makeKarmaRepository = (
	remote: KarmaRemoteDataSource
): KarmaRepository => ({
	getSettings: async (guildId) =>
		toKarmaSettings(await remote.getSettings(guildId)),
	updateSettings: async (guildId, input) =>
		toKarmaSettings(await remote.updateSettings(guildId, input)),
	getLeaderboard: async (guildId, parameters) =>
		toKarmaLeaderboardPage(await remote.getLeaderboard(guildId, parameters)),
});
