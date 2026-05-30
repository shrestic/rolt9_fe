import { objectToSnake } from "ts-case-convert";
import { http } from "@/utils/http";
import { endpoints } from "@/settings/endpoints";
import type { KarmaSettingsInput } from "@/data/models/karma";

// Pagination params for the karma leaderboard query.
export type KarmaLeaderboardParameters = {
	page?: number;
	pageSize?: number;
};

// The remote data source returns raw `unknown` payloads; the repository layer
// is responsible for validating/parsing them into typed models. This mirrors
// the currency remote exactly.
export type KarmaRemoteDataSource = {
	getSettings: (guildId: string) => Promise<unknown>;
	updateSettings: (
		guildId: string,
		input: KarmaSettingsInput
	) => Promise<unknown>;
	getLeaderboard: (
		guildId: string,
		parameters: KarmaLeaderboardParameters
	) => Promise<unknown>;
};

export const makeKarmaRemote = (client = http): KarmaRemoteDataSource => ({
	getSettings: async (guildId) =>
		(await client.get(endpoints.karmaSettings(guildId))).data as unknown,
	updateSettings: async (guildId, input) =>
		// Outgoing body is converted to snake_case to match the API contract.
		(
			await client.put(
				endpoints.karmaSettings(guildId),
				objectToSnake(input)
			)
		).data as unknown,
	getLeaderboard: async (guildId, parameters) =>
		(
			await client.get(endpoints.karmaLeaderboard(guildId), {
				params: {
					page: parameters.page,
					// eslint-disable-next-line camelcase
					page_size: parameters.pageSize,
				},
			})
		).data as unknown,
});
