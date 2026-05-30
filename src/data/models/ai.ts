import { z } from "zod";
import { camelObject } from "@/utils/zod";

// AI settings (+ read-only monthly usage). Wire is snake_case; camelObject
// converts to the camelCase shape here.
export const AiSettingsSchema = camelObject({
	enabled: z.boolean(),
	monthlyTokenBudget: z.number().int(),
	persona: z.string(),
	tokensUsedThisMonth: z.number().int(),
});
export type AiSettings = z.infer<typeof AiSettingsSchema>;
export const toAiSettings = (raw: unknown): AiSettings => AiSettingsSchema.parse(raw);

// PUT payload — only the tunable fields (usage is read-only).
export type AiSettingsInput = {
	enabled: boolean;
	monthlyTokenBudget: number;
	persona: string;
};

// Knowledge-base entry (for /ask).
export const KbEntrySchema = camelObject({
	id: z.string(),
	title: z.string(),
	content: z.string(),
});
export type KbEntry = z.infer<typeof KbEntrySchema>;
export const toKbEntries = (raw: unknown): Array<KbEntry> =>
	z.array(KbEntrySchema).parse(raw);
export const toKbEntry = (raw: unknown): KbEntry => KbEntrySchema.parse(raw);
export type KbEntryInput = { title: string; content: string };
