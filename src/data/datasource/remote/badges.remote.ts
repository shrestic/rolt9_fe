import { objectToSnake } from "ts-case-convert";
import { http } from "@/utils/http";
import { endpoints } from "@/settings/endpoints";
import type { BadgeSettingsInput } from "@/data/models/badges";

// The remote data source returns raw `unknown` payloads; the repository layer
// is responsible for validating/parsing them into typed models. Mirrors the
// currency remote exactly, but scoped to badges.
export type BadgesRemoteDataSource = {
	getSettings: (guildId: string) => Promise<unknown>;
	updateSettings: (
		guildId: string,
		input: BadgeSettingsInput
	) => Promise<unknown>;
	// Returns the full catalog array for the guild (static, rarely changes).
	getCatalog: (guildId: string) => Promise<unknown>;
};

export const makeBadgesRemote = (client = http): BadgesRemoteDataSource => ({
	getSettings: async (guildId) =>
		(await client.get(endpoints.badgeSettings(guildId))).data as unknown,
	updateSettings: async (guildId, input) =>
		// Outgoing body is converted to snake_case to match the API contract.
		(
			await client.put(
				endpoints.badgeSettings(guildId),
				objectToSnake(input)
			)
		).data as unknown,
	getCatalog: async (guildId) =>
		(await client.get(endpoints.badgeCatalog(guildId))).data as unknown,
});
