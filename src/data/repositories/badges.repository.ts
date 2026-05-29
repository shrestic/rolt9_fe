import type { BadgesRemoteDataSource } from "@/data/datasource/remote/badges.remote";
import {
	toBadgeCatalog,
	toBadgeSettings,
	type BadgeCatalogEntry,
	type BadgeSettings,
	type BadgeSettingsInput,
} from "@/data/models/badges";

// The repository wraps the remote data source and turns every raw response
// into a validated, typed model via the `to*` parser functions. Mirrors the
// currency repository one-to-one.
export type BadgesRepository = {
	getSettings: (guildId: string) => Promise<BadgeSettings>;
	updateSettings: (
		guildId: string,
		input: BadgeSettingsInput
	) => Promise<BadgeSettings>;
	// Returns the full badge catalog for the guild.
	getCatalog: (guildId: string) => Promise<Array<BadgeCatalogEntry>>;
};

export const makeBadgesRepository = (
	remote: BadgesRemoteDataSource
): BadgesRepository => ({
	getSettings: async (guildId) =>
		toBadgeSettings(await remote.getSettings(guildId)),
	updateSettings: async (guildId, input) =>
		toBadgeSettings(await remote.updateSettings(guildId, input)),
	getCatalog: async (guildId) =>
		toBadgeCatalog(await remote.getCatalog(guildId)),
});
