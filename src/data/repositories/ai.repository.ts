import type { AiRemoteDataSource } from "@/data/datasource/remote/ai.remote";
import {
	toAiSettings,
	toKbEntries,
	toKbEntry,
	type AiSettings,
	type AiSettingsInput,
	type KbEntry,
	type KbEntryInput,
} from "@/data/models/ai";

// Wraps the remote, parsing every raw response into a validated typed model.
export type AiRepository = {
	getSettings: (guildId: string) => Promise<AiSettings>;
	updateSettings: (
		guildId: string,
		input: AiSettingsInput
	) => Promise<AiSettings>;
	listKb: (guildId: string) => Promise<Array<KbEntry>>;
	createKb: (guildId: string, input: KbEntryInput) => Promise<KbEntry>;
	deleteKb: (guildId: string, entryId: string) => Promise<void>;
};

export const makeAiRepository = (remote: AiRemoteDataSource): AiRepository => ({
	getSettings: async (guildId) => toAiSettings(await remote.getSettings(guildId)),
	updateSettings: async (guildId, input) =>
		toAiSettings(await remote.updateSettings(guildId, input)),
	listKb: async (guildId) => toKbEntries(await remote.listKb(guildId)),
	createKb: async (guildId, input) =>
		toKbEntry(await remote.createKb(guildId, input)),
	deleteKb: async (guildId, entryId) => {
		await remote.deleteKb(guildId, entryId);
	},
});
