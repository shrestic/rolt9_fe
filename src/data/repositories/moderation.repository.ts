import type {
	ListCasesParameters,
	ModerationRemoteDataSource,
} from "@/data/datasource/remote/moderation.remote";
import {
	toCasesPage,
	toModerationSettings,
	type CasesPage,
	type ModerationSettings,
	type ModerationSettingsInput,
} from "@/data/models/moderation";

export type ModerationRepository = {
	getSettings: (guildId: string) => Promise<ModerationSettings>;
	updateSettings: (
		guildId: string,
		input: ModerationSettingsInput
	) => Promise<ModerationSettings>;
	listCases: (guildId: string, parameters: ListCasesParameters) => Promise<CasesPage>;
	deactivateCase: (guildId: string, caseNumber: number) => Promise<void>;
};

export const makeModerationRepository = (
	remote: ModerationRemoteDataSource
): ModerationRepository => ({
	getSettings: async (guildId) => toModerationSettings(await remote.getSettings(guildId)),
	updateSettings: async (guildId, input) =>
		toModerationSettings(await remote.updateSettings(guildId, input)),
	listCases: async (guildId, parameters) =>
		toCasesPage(await remote.listCases(guildId, parameters)),
	deactivateCase: async (guildId, caseNumber): Promise<void> => {
		await remote.deactivateCase(guildId, caseNumber);
	},
});
