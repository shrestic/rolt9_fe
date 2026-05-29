import type {
	LeaderboardParameters,
	LevelingRemoteDataSource,
} from "@/data/datasource/remote/leveling.remote";
import {
	LevelRewardSchema,
	toLeaderboardPage,
	toLevelingSettings,
	toMemberXp,
	toRankCardTheme,
	type LeaderboardPage,
	type LevelReward,
	type LevelRewardInput,
	type LevelingSettings,
	type LevelingSettingsInput,
	type MemberXp,
	type RankCardTheme,
	type RankCardThemeInput,
} from "@/data/models/leveling";
import { z } from "zod";

const LevelRewardsSchema = z.array(LevelRewardSchema);
const toLevelRewards = (raw: unknown): Array<LevelReward> =>
	LevelRewardsSchema.parse(raw);

export type LevelingRepository = {
	getSettings: (guildId: string) => Promise<LevelingSettings>;
	updateSettings: (
		guildId: string,
		input: LevelingSettingsInput
	) => Promise<LevelingSettings>;
	getLeaderboard: (
		guildId: string,
		parameters: LeaderboardParameters
	) => Promise<LeaderboardPage>;
	getMember: (guildId: string, userId: string) => Promise<MemberXp>;
	updateMember: (
		guildId: string,
		userId: string,
		input: { totalXp: number }
	) => Promise<MemberXp>;
	resetMember: (guildId: string, userId: string) => Promise<void>;
	getRewards: (guildId: string) => Promise<Array<LevelReward>>;
	createReward: (guildId: string, input: LevelRewardInput) => Promise<LevelReward>;
	deleteReward: (guildId: string, level: number) => Promise<void>;
	getTheme: (guildId: string) => Promise<RankCardTheme>;
	updateTheme: (
		guildId: string,
		input: RankCardThemeInput
	) => Promise<RankCardTheme>;
};

export const makeLevelingRepository = (
	remote: LevelingRemoteDataSource
): LevelingRepository => ({
	getSettings: async (guildId) => toLevelingSettings(await remote.getSettings(guildId)),
	updateSettings: async (guildId, input) =>
		toLevelingSettings(await remote.updateSettings(guildId, input)),
	getLeaderboard: async (guildId, parameters) =>
		toLeaderboardPage(await remote.getLeaderboard(guildId, parameters)),
	getMember: async (guildId, userId) =>
		toMemberXp(await remote.getMember(guildId, userId)),
	updateMember: async (guildId, userId, input) =>
		toMemberXp(await remote.updateMember(guildId, userId, input)),
	resetMember: async (guildId, userId): Promise<void> => {
		await remote.resetMember(guildId, userId);
	},
	getRewards: async (guildId) => toLevelRewards(await remote.getRewards(guildId)),
	createReward: async (guildId, input) =>
		LevelRewardSchema.parse(await remote.createReward(guildId, input)),
	deleteReward: async (guildId, level): Promise<void> => {
		await remote.deleteReward(guildId, level);
	},
	getTheme: async (guildId) => toRankCardTheme(await remote.getTheme(guildId)),
	updateTheme: async (guildId, input) =>
		toRankCardTheme(await remote.updateTheme(guildId, input)),
});
