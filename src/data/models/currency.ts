import { z } from "zod";
import { camelObject } from "@/utils/zod";

// ---------------------------------------------------------------------------
// Currency settings
// ---------------------------------------------------------------------------
// The wire format is snake_case (e.g. currency_name); `camelObject` runs the
// raw payload through objectToCamel before validating, so here we describe the
// already-camelCased shape (currencyName, earnMin, ...).
export const CurrencySettingsSchema = camelObject({
	// Master toggle for the whole currency/economy system.
	enabled: z.boolean(),
	// Display name of the currency, e.g. "coins". BE enforces 1-32 chars.
	currencyName: z.string(),
	// Emoji shown next to balances, e.g. "🪙". BE enforces 1-32 chars.
	currencyEmoji: z.string(),
	// Lowest amount a member can earn per qualifying message.
	earnMin: z.number().int(),
	// Highest amount a member can earn per qualifying message (>= earnMin).
	earnMax: z.number().int(),
	// Amount granted by the daily claim command.
	dailyAmount: z.number().int(),
	// Whether members may transfer currency to each other (the "pay" command).
	allowPay: z.boolean(),
});
export type CurrencySettings = z.infer<typeof CurrencySettingsSchema>;
export const toCurrencySettings = (raw: unknown): CurrencySettings =>
	CurrencySettingsSchema.parse(raw);

// Shape used when sending settings back to the API. It is identical to the
// parsed settings, but kept as a separate plain type (mirroring leveling) so
// the mutation/input contract is explicit and never coupled to the zod schema.
export type CurrencySettingsInput = {
	enabled: boolean;
	currencyName: string;
	currencyEmoji: string;
	earnMin: number;
	earnMax: number;
	dailyAmount: number;
	allowPay: boolean;
};

// ---------------------------------------------------------------------------
// Wallet leaderboard
// ---------------------------------------------------------------------------
// A single row in the richest-members leaderboard.
export const WalletLeaderboardEntrySchema = camelObject({
	// 1-based position in the leaderboard.
	rank: z.number().int(),
	// Discord user snowflake id (kept as a string to avoid precision loss).
	userId: z.string(),
	// Current wallet balance for this member.
	balance: z.number().int(),
});
export type WalletLeaderboardEntry = z.infer<
	typeof WalletLeaderboardEntrySchema
>;

// A single page of the wallet leaderboard with pagination metadata.
export const WalletLeaderboardPageSchema = camelObject({
	items: z.array(WalletLeaderboardEntrySchema),
	total: z.number().int(),
	page: z.number().int(),
	pageSize: z.number().int(),
});
export type WalletLeaderboardPage = z.infer<typeof WalletLeaderboardPageSchema>;
export const toWalletLeaderboardPage = (raw: unknown): WalletLeaderboardPage =>
	WalletLeaderboardPageSchema.parse(raw);

// ---------------------------------------------------------------------------
// Single member wallet (admin lookup / edit response)
// ---------------------------------------------------------------------------
export const WalletMemberSchema = camelObject({
	userId: z.string(),
	rank: z.number().int(),
	balance: z.number().int(),
});
export type WalletMember = z.infer<typeof WalletMemberSchema>;
export const toWalletMember = (raw: unknown): WalletMember =>
	WalletMemberSchema.parse(raw);
