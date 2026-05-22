import { z } from "zod";
import { camelObject } from "@/utils/zod";

export const ChannelSchema = z.object({
	id: z.string(),
	name: z.string(),
	type: z.number(),
});
export const RoleSchema = z.object({ id: z.string(), name: z.string() });
export type Channel = z.infer<typeof ChannelSchema>;
export type Role = z.infer<typeof RoleSchema>;

export const GuildSummarySchema = camelObject({
	discordId: z.string(),
	name: z.string(),
	iconUrl: z.string().nullable(),
	botPresent: z.boolean(),
	canManage: z.boolean(),
});
export type GuildSummary = z.infer<typeof GuildSummarySchema>;
export const toGuildSummaries = (raw: unknown): Array<GuildSummary> =>
	z.array(GuildSummarySchema).parse(raw);

export const GuildOverviewSchema = camelObject({
	discordId: z.string(),
	name: z.string(),
	iconUrl: z.string().nullable(),
	memberCount: z.number(),
	channels: z.array(ChannelSchema),
	roles: z.array(RoleSchema),
	botPresent: z.boolean(),
});
export type GuildOverview = z.infer<typeof GuildOverviewSchema>;
export const toGuildOverview = (raw: unknown): GuildOverview =>
	GuildOverviewSchema.parse(raw);
