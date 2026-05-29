import type {
	CurrencyRemoteDataSource,
	WalletLeaderboardParameters,
} from "@/data/datasource/remote/currency.remote";
import {
	toCurrencySettings,
	toWalletLeaderboardPage,
	toWalletMember,
	type CurrencySettings,
	type CurrencySettingsInput,
	type WalletLeaderboardPage,
	type WalletMember,
} from "@/data/models/currency";

// The repository wraps the remote data source and turns every raw response
// into a validated, typed model via the `to*` parser functions. This mirrors
// the leveling repository one-to-one.
export type CurrencyRepository = {
	getSettings: (guildId: string) => Promise<CurrencySettings>;
	updateSettings: (
		guildId: string,
		input: CurrencySettingsInput
	) => Promise<CurrencySettings>;
	getLeaderboard: (
		guildId: string,
		parameters: WalletLeaderboardParameters
	) => Promise<WalletLeaderboardPage>;
	getMember: (guildId: string, userId: string) => Promise<WalletMember>;
	updateMember: (
		guildId: string,
		userId: string,
		input: { balance: number }
	) => Promise<WalletMember>;
	resetMember: (guildId: string, userId: string) => Promise<WalletMember>;
};

export const makeCurrencyRepository = (
	remote: CurrencyRemoteDataSource
): CurrencyRepository => ({
	getSettings: async (guildId) =>
		toCurrencySettings(await remote.getSettings(guildId)),
	updateSettings: async (guildId, input) =>
		toCurrencySettings(await remote.updateSettings(guildId, input)),
	getLeaderboard: async (guildId, parameters) =>
		toWalletLeaderboardPage(await remote.getLeaderboard(guildId, parameters)),
	getMember: async (guildId, userId) =>
		toWalletMember(await remote.getMember(guildId, userId)),
	updateMember: async (guildId, userId, input) =>
		toWalletMember(await remote.updateMember(guildId, userId, input)),
	resetMember: async (guildId, userId) =>
		toWalletMember(await remote.resetMember(guildId, userId)),
});
