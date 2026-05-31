import { z } from "zod";
import { camelObject } from "@/utils/zod";

// AI settings (BYO-key v2 + read-only monthly usage). Wire is snake_case;
// camelObject converts to the camelCase shape here. Decimal fields (budget,
// cost) arrive as strings over JSON, so coerce them to numbers.
export const AiSettingsSchema = camelObject({
	enabled: z.boolean(),
	provider: z.string(),
	model: z.string(),
	monthlyBudgetUsd: z.coerce.number(),
	persona: z.string(),
	agentEnabled: z.boolean(),
	agentChannelId: z.string().nullable(),
	toolsEnabled: z.boolean(),
	hasKey: z.boolean(),
	keyHint: z.string(),
	tokensUsedThisMonth: z.number().int(),
	costUsedThisMonth: z.coerce.number(),
});
export type AiSettings = z.infer<typeof AiSettingsSchema>;
export const toAiSettings = (raw: unknown): AiSettings => AiSettingsSchema.parse(raw);

// PUT payload — apiKey ghi-một-chiều: undefined=giữ key cũ, ""=xóa, "sk-..."=đặt mới.
export type AiSettingsInput = {
	enabled: boolean;
	provider: string;
	model: string;
	monthlyBudgetUsd: number;
	persona: string;
	agentEnabled: boolean;
	agentChannelId: string | null;
	toolsEnabled: boolean;
	apiKey?: string;
};

// Catalog provider/model cho dropdown (từ GET /ai/catalog).
export const AiCatalogSchema = z.record(
	z.string(),
	z.object({ label: z.string(), models: z.array(z.string()) })
);
export type AiCatalog = z.infer<typeof AiCatalogSchema>;
export const toAiCatalog = (raw: unknown): AiCatalog => AiCatalogSchema.parse(raw);

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
