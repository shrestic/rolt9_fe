import { z } from "zod";
import { camelObject } from "@/utils/zod";

// ---------------------------------------------------------------------------
// Badge settings
// ---------------------------------------------------------------------------
// The wire format is snake_case; `camelObject` runs the raw payload through
// objectToCamel before validating, so here we describe the camelCased shape.
export const BadgeSettingsSchema = camelObject({
	// Master toggle — when false, no badges are awarded or shown.
	enabled: z.boolean(),
});
export type BadgeSettings = z.infer<typeof BadgeSettingsSchema>;
export const toBadgeSettings = (raw: unknown): BadgeSettings =>
	BadgeSettingsSchema.parse(raw);

// Shape used when PUTting settings back to the API. Explicit type so the
// mutation contract is never coupled to the zod schema (mirrors currency).
export type BadgeSettingsInput = { enabled: boolean };

// ---------------------------------------------------------------------------
// Badge catalog entry
// ---------------------------------------------------------------------------
// Each entry describes one earnable badge. The catalog is static (server-
// configured) so the FE treats it as read-only.
export const BadgeCatalogEntrySchema = camelObject({
	// Unique machine key, e.g. "level_10".
	key: z.string(),
	// Human-readable display name, e.g. "Level 10".
	name: z.string(),
	// Emoji icon shown next to the badge name.
	emoji: z.string(),
	// Short explanation of how to earn the badge.
	description: z.string(),
	// Which stat is checked (e.g. "level", "longest_streak", "balance").
	stat: z.string(),
	// Numeric threshold the member must reach or exceed.
	threshold: z.number().int(),
});
export type BadgeCatalogEntry = z.infer<typeof BadgeCatalogEntrySchema>;
export const toBadgeCatalog = (raw: unknown): Array<BadgeCatalogEntry> =>
	z.array(BadgeCatalogEntrySchema).parse(raw);
