import { z } from "zod";
import { camelObject } from "@/utils/zod";

export const EscalationRuleSchema = z.object({
	threshold: z.number().int().min(1),
	action: z.enum(["mute", "ban"]),
	durationSeconds: z.number().int().nullable().optional(),
});
export type EscalationRule = z.infer<typeof EscalationRuleSchema>;

export const ModerationSettingsSchema = camelObject({
	modLogChannelId: z.string().nullable(),
	dmOnAction: z.boolean(),
	warnEscalation: z.array(EscalationRuleSchema),
});
export type ModerationSettings = z.infer<typeof ModerationSettingsSchema>;
export const toModerationSettings = (raw: unknown): ModerationSettings =>
	ModerationSettingsSchema.parse(raw);

export const ModerationCaseSchema = z.object({
	caseNumber: z.number(),
	action: z.string(),
	source: z.string(),
	targetUserId: z.string(),
	targetUsername: z.string(),
	moderatorUserId: z.string(),
	moderatorUsername: z.string(),
	reason: z.string().nullable(),
	durationSeconds: z.number().nullable(),
	createdAt: z.string(),
	active: z.boolean(),
});
export type ModerationCase = z.infer<typeof ModerationCaseSchema>;

export const CasesPageSchema = camelObject({
	items: z.array(ModerationCaseSchema),
	total: z.number(),
	page: z.number(),
	pageSize: z.number(),
});
export type CasesPage = z.infer<typeof CasesPageSchema>;
export const toCasesPage = (raw: unknown): CasesPage => CasesPageSchema.parse(raw);

export type ModerationSettingsInput = {
	modLogChannelId: string | null;
	dmOnAction: boolean;
	warnEscalation: Array<EscalationRule>;
};
