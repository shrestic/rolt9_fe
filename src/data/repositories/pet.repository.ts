import type { PetRemoteDataSource } from "@/data/datasource/remote/pet.remote";
import {
	toPetSettings,
	toPetStatus,
	type PetSettings,
	type PetSettingsInput,
	type PetStatus,
} from "@/data/models/pet";

// The repository wraps the remote data source and turns every raw response
// into a validated, typed model via the `to*` parser functions. This mirrors
// the currency repository one-to-one.
export type PetRepository = {
	getSettings: (guildId: string) => Promise<PetSettings>;
	updateSettings: (
		guildId: string,
		input: PetSettingsInput
	) => Promise<PetSettings>;
	// Returns the live state of the pet for a guild (hunger, happiness, etc.).
	getStatus: (guildId: string) => Promise<PetStatus>;
};

export const makePetRepository = (
	remote: PetRemoteDataSource
): PetRepository => ({
	getSettings: async (guildId) =>
		toPetSettings(await remote.getSettings(guildId)),
	updateSettings: async (guildId, input) =>
		toPetSettings(await remote.updateSettings(guildId, input)),
	getStatus: async (guildId) =>
		toPetStatus(await remote.getStatus(guildId)),
});
