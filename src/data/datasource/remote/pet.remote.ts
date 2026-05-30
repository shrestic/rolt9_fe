import { objectToSnake } from "ts-case-convert";
import { http } from "@/utils/http";
import { endpoints } from "@/settings/endpoints";
import type { PetSettingsInput } from "@/data/models/pet";

// The remote data source returns raw `unknown` payloads; the repository layer
// is responsible for validating/parsing them into typed models. This mirrors
// the currency remote exactly.
export type PetRemoteDataSource = {
	getSettings: (guildId: string) => Promise<unknown>;
	updateSettings: (
		guildId: string,
		input: PetSettingsInput
	) => Promise<unknown>;
	// Read-only live state of the pet (hunger, happiness, level, etc.).
	getStatus: (guildId: string) => Promise<unknown>;
};

export const makePetRemote = (client = http): PetRemoteDataSource => ({
	getSettings: async (guildId) =>
		(await client.get(endpoints.petSettings(guildId))).data as unknown,
	updateSettings: async (guildId, input) =>
		// Outgoing body is converted to snake_case to match the API contract.
		(
			await client.put(
				endpoints.petSettings(guildId),
				objectToSnake(input)
			)
		).data as unknown,
	getStatus: async (guildId) =>
		(await client.get(endpoints.petStatus(guildId))).data as unknown,
});
