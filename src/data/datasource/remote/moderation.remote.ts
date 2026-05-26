import { objectToSnake } from "ts-case-convert";
import { http } from "@/utils/http";
import { endpoints } from "@/settings/endpoints";
import type { ModerationSettingsInput } from "@/data/models/moderation";

export type ListCasesParameters = {
	targetUserId?: string;
	action?: string;
	page?: number;
};

export type ModerationRemoteDataSource = {
	getSettings: (guildId: string) => Promise<unknown>;
	updateSettings: (guildId: string, input: ModerationSettingsInput) => Promise<unknown>;
	listCases: (guildId: string, parameters: ListCasesParameters) => Promise<unknown>;
	deactivateCase: (guildId: string, caseNumber: number) => Promise<unknown>;
};

export const makeModerationRemote = (client = http): ModerationRemoteDataSource => ({
	getSettings: async (guildId) =>
		(await client.get(endpoints.moderationSettings(guildId))).data as unknown,
	updateSettings: async (guildId, input) =>
		(await client.put(endpoints.moderationSettings(guildId), objectToSnake(input)))
			.data as unknown,
	listCases: async (guildId, parameters) =>
		(
			await client.get(endpoints.cases(guildId), {
				params: {
					// eslint-disable-next-line camelcase
					target_user_id: parameters.targetUserId,
					action: parameters.action,
					page: parameters.page,
				},
			})
		).data as unknown,
	deactivateCase: async (guildId, caseNumber) =>
		(await client.delete(endpoints.case(guildId, caseNumber))).data as unknown,
});
