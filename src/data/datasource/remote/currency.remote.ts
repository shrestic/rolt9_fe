import { objectToSnake } from "ts-case-convert";
import { http } from "@/utils/http";
import { endpoints } from "@/settings/endpoints";
import type { CurrencySettingsInput } from "@/data/models/currency";

// Pagination params for the wallet leaderboard query.
export type WalletLeaderboardParameters = {
	page?: number;
	pageSize?: number;
};

// The remote data source returns raw `unknown` payloads; the repository layer
// is responsible for validating/parsing them into typed models. This mirrors
// the leveling remote exactly.
export type CurrencyRemoteDataSource = {
	getSettings: (guildId: string) => Promise<unknown>;
	updateSettings: (
		guildId: string,
		input: CurrencySettingsInput
	) => Promise<unknown>;
	getLeaderboard: (
		guildId: string,
		parameters: WalletLeaderboardParameters
	) => Promise<unknown>;
	getMember: (guildId: string, userId: string) => Promise<unknown>;
	updateMember: (
		guildId: string,
		userId: string,
		input: { balance: number }
	) => Promise<unknown>;
	resetMember: (guildId: string, userId: string) => Promise<unknown>;
};

export const makeCurrencyRemote = (
	client = http
): CurrencyRemoteDataSource => ({
	getSettings: async (guildId) =>
		(await client.get(endpoints.currencySettings(guildId))).data as unknown,
	updateSettings: async (guildId, input) =>
		// Outgoing body is converted to snake_case to match the API contract.
		(
			await client.put(
				endpoints.currencySettings(guildId),
				objectToSnake(input)
			)
		).data as unknown,
	getLeaderboard: async (guildId, parameters) =>
		(
			await client.get(endpoints.currencyLeaderboard(guildId), {
				params: {
					page: parameters.page,
					// eslint-disable-next-line camelcase
					page_size: parameters.pageSize,
				},
			})
		).data as unknown,
	getMember: async (guildId, userId) =>
		(await client.get(endpoints.currencyMember(guildId, userId)))
			.data as unknown,
	updateMember: async (guildId, userId, input) =>
		// Balance edits use PATCH per the backend contract.
		(
			await client.patch(
				endpoints.currencyMember(guildId, userId),
				objectToSnake(input)
			)
		).data as unknown,
	resetMember: async (guildId, userId) =>
		// DELETE resets the balance to 0 and returns the updated member.
		(await client.delete(endpoints.currencyMember(guildId, userId)))
			.data as unknown,
});
