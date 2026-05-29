import { z } from "zod";
import { camelObject } from "@/utils/zod";

export const LevelingSettingsSchema = camelObject({
	enabled: z.boolean(),
	xpMin: z.number().int(),
	xpMax: z.number().int(),
	cooldownSeconds: z.number().int(),
	minMessageLength: z.number().int(),
	ignoreEmojiOnly: z.boolean(),
	ignoreLinkOnly: z.boolean(),
	ignoredChannelIds: z.array(z.string()),
	ignoredRoleIds: z.array(z.string()),
	notificationMode: z.enum(["channel", "dm", "off"]),
	notificationChannelId: z.string().nullable(),
	levelRoleMode: z.enum(["stacking", "replacing"]),
	xpDecayEnabled: z.boolean(),
	xpDecayPercent: z.number().int(),
	xpDecayInactivityDays: z.number().int(),
});
export type LevelingSettings = z.infer<typeof LevelingSettingsSchema>;
export const toLevelingSettings = (raw: unknown): LevelingSettings =>
	LevelingSettingsSchema.parse(raw);

export const LeaderboardEntrySchema = camelObject({
	rank: z.number().int(),
	userId: z.string(),
	totalXp: z.number().int(),
	level: z.number().int(),
});
export type LeaderboardEntry = z.infer<typeof LeaderboardEntrySchema>;

export const LeaderboardPageSchema = camelObject({
	items: z.array(LeaderboardEntrySchema),
	total: z.number().int(),
	page: z.number().int(),
	pageSize: z.number().int(),
});
export type LeaderboardPage = z.infer<typeof LeaderboardPageSchema>;
export const toLeaderboardPage = (raw: unknown): LeaderboardPage =>
	LeaderboardPageSchema.parse(raw);

export const MemberXpSchema = camelObject({
	userId: z.string(),
	rank: z.number().int(),
	level: z.number().int(),
	totalXp: z.number().int(),
	xpIntoLevel: z.number().int(),
	xpForNextLevel: z.number().int(),
});
export type MemberXp = z.infer<typeof MemberXpSchema>;
export const toMemberXp = (raw: unknown): MemberXp => MemberXpSchema.parse(raw);

export const RankCardThemeSchema = camelObject({
	bgType: z.enum(["solid", "gradient", "image"]),
	bgColor1: z.string(),
	bgColor2: z.string(),
	accentColor: z.string(),
	textColor: z.string(),
	bgImageUrl: z.string().nullable(),
});
export type RankCardTheme = z.infer<typeof RankCardThemeSchema>;
export const toRankCardTheme = (raw: unknown): RankCardTheme =>
	RankCardThemeSchema.parse(raw);

export const LevelRewardSchema = camelObject({
	level: z.number().int(),
	roleId: z.string(),
});
export type LevelReward = z.infer<typeof LevelRewardSchema>;

export type LevelingSettingsInput = {
	enabled: boolean;
	xpMin: number;
	xpMax: number;
	cooldownSeconds: number;
	minMessageLength: number;
	ignoreEmojiOnly: boolean;
	ignoreLinkOnly: boolean;
	ignoredChannelIds: Array<string>;
	ignoredRoleIds: Array<string>;
	notificationMode: "channel" | "dm" | "off";
	notificationChannelId: string | null;
	levelRoleMode: "stacking" | "replacing";
	xpDecayEnabled: boolean;
	xpDecayPercent: number;
	xpDecayInactivityDays: number;
};

export type RankCardThemeInput = {
	bgType: "solid" | "gradient" | "image";
	bgColor1: string;
	bgColor2: string;
	accentColor: string;
	textColor: string;
	bgImageUrl: string | null;
};

export type LevelRewardInput = {
	level: number;
	roleId: string;
};
