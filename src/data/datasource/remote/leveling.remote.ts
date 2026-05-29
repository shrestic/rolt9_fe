import { objectToSnake } from "ts-case-convert";
import { http } from "@/utils/http";
import { endpoints } from "@/settings/endpoints";
import type {
	LevelRewardInput,
	LevelingSettingsInput,
	RankCardThemeInput,
} from "@/data/models/leveling";

export type LeaderboardParameters = {
	page?: number;
	pageSize?: number;
};

export type LevelingRemoteDataSource = {
	getSettings: (guildId: string) => Promise<unknown>;
	updateSettings: (guildId: string, input: LevelingSettingsInput) => Promise<unknown>;
	getLeaderboard: (
		guildId: string,
		parameters: LeaderboardParameters
	) => Promise<unknown>;
	getMember: (guildId: string, userId: string) => Promise<unknown>;
	updateMember: (
		guildId: string,
		userId: string,
		input: { totalXp: number }
	) => Promise<unknown>;
	resetMember: (guildId: string, userId: string) => Promise<void>;
	getRewards: (guildId: string) => Promise<unknown>;
	createReward: (guildId: string, input: LevelRewardInput) => Promise<unknown>;
	deleteReward: (guildId: string, level: number) => Promise<void>;
	getTheme: (guildId: string) => Promise<unknown>;
	updateTheme: (guildId: string, input: RankCardThemeInput) => Promise<unknown>;
};

export const makeLevelingRemote = (client = http): LevelingRemoteDataSource => ({
	getSettings: async (guildId) =>
		(await client.get(endpoints.levelingSettings(guildId))).data as unknown,
	updateSettings: async (guildId, input) =>
		(await client.put(endpoints.levelingSettings(guildId), objectToSnake(input)))
			.data as unknown,
	getLeaderboard: async (guildId, parameters) =>
		(
			await client.get(endpoints.levelingLeaderboard(guildId), {
				params: {
					page: parameters.page,
					// eslint-disable-next-line camelcase
					page_size: parameters.pageSize,
				},
			})
		).data as unknown,
	getMember: async (guildId, userId) =>
		(await client.get(endpoints.levelingMember(guildId, userId))).data as unknown,
	updateMember: async (guildId, userId, input) =>
		(
			await client.put(
				endpoints.levelingMember(guildId, userId),
				objectToSnake(input)
			)
		).data as unknown,
	resetMember: async (guildId, userId): Promise<void> => {
		await client.delete(endpoints.levelingMember(guildId, userId));
	},
	getRewards: async (guildId) =>
		(await client.get(endpoints.levelingRewards(guildId))).data as unknown,
	createReward: async (guildId, input) =>
		(await client.post(endpoints.levelingRewards(guildId), objectToSnake(input)))
			.data as unknown,
	deleteReward: async (guildId, level): Promise<void> => {
		await client.delete(endpoints.levelingReward(guildId, level));
	},
	getTheme: async (guildId) =>
		(await client.get(endpoints.levelingTheme(guildId))).data as unknown,
	updateTheme: async (guildId, input) =>
		(await client.put(endpoints.levelingTheme(guildId), objectToSnake(input)))
			.data as unknown,
});
