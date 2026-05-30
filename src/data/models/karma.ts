import { z } from "zod";
import { camelObject } from "@/utils/zod";

// ---------------------------------------------------------------------------
// Karma settings
// ---------------------------------------------------------------------------
// The wire format is snake_case; `camelObject` converts the raw payload to
// camelCase before validating, so here we describe the already-camelCased shape.
export const KarmaSettingsSchema = camelObject({
	// Master toggle for the karma/reputation system.
	enabled: z.boolean(),
});
export type KarmaSettings = z.infer<typeof KarmaSettingsSchema>;
export const toKarmaSettings = (raw: unknown): KarmaSettings =>
	KarmaSettingsSchema.parse(raw);

// Shape used when sending settings back to the API. Kept as a separate plain
// type so the mutation/input contract is explicit and never coupled to the
// zod schema.
export type KarmaSettingsInput = {
	enabled: boolean;
};

// ---------------------------------------------------------------------------
// Karma leaderboard
// ---------------------------------------------------------------------------
// A single row in the top-karma-members leaderboard.
export const KarmaLeaderboardEntrySchema = camelObject({
	// 1-based position in the leaderboard.
	rank: z.number().int(),
	// Discord user snowflake id (kept as a string to avoid precision loss).
	userId: z.string(),
	// Total karma points accumulated by this member.
	points: z.number().int(),
});
export type KarmaLeaderboardEntry = z.infer<typeof KarmaLeaderboardEntrySchema>;

// A single page of the karma leaderboard with pagination metadata.
export const KarmaLeaderboardPageSchema = camelObject({
	items: z.array(KarmaLeaderboardEntrySchema),
	total: z.number().int(),
	page: z.number().int(),
	pageSize: z.number().int(),
});
export type KarmaLeaderboardPage = z.infer<typeof KarmaLeaderboardPageSchema>;
export const toKarmaLeaderboardPage = (raw: unknown): KarmaLeaderboardPage =>
	KarmaLeaderboardPageSchema.parse(raw);
