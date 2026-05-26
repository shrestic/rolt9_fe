import { z } from "zod";
import { camelObject } from "@/utils/zod";

export const EmbedSpecSchema = z.object({
	title: z.string().nullable().optional(),
	description: z.string().nullable().optional(),
	color: z.string().nullable().optional(),
	imageUrl: z.string().nullable().optional(),
	footer: z.string().nullable().optional(),
});
export type EmbedSpec = z.infer<typeof EmbedSpecSchema>;

export const CustomCommandSchema = camelObject({
	id: z.string(),
	trigger: z.string(),
	responseType: z.enum(["text", "embed"]),
	responseText: z.string().nullable(),
	embed: EmbedSpecSchema.nullable(),
	allowedRoleIds: z.array(z.string()),
	allowedChannelIds: z.array(z.string()),
	cooldownSeconds: z.number(),
	enabled: z.boolean(),
});
export type CustomCommand = z.infer<typeof CustomCommandSchema>;
export const toCommands = (raw: unknown): Array<CustomCommand> =>
	z.array(CustomCommandSchema).parse(raw);
export const toCommand = (raw: unknown): CustomCommand =>
	CustomCommandSchema.parse(raw);

export const CommandSettingsSchema = camelObject({
	prefix: z.string(),
	enabled: z.boolean(),
});
export type CommandSettings = z.infer<typeof CommandSettingsSchema>;
export const toCommandSettings = (raw: unknown): CommandSettings =>
	CommandSettingsSchema.parse(raw);

export type CustomCommandInput = {
	trigger: string;
	responseType: "text" | "embed";
	responseText?: string | null;
	embed?: EmbedSpec | null;
	allowedRoleIds: Array<string>;
	allowedChannelIds: Array<string>;
	cooldownSeconds: number;
	enabled: boolean;
};

// Live preview — admin sees rendered output before saving the command.
// Mirrors the BE schema in app/schemas/custom_command.py.
export const PlaceholderInfoSchema = z.object({
	name: z.string(),
	description: z.string(),
	example: z.string(),
});
export type PlaceholderInfo = z.infer<typeof PlaceholderInfoSchema>;

export const RenderedEmbedSchema = camelObject({
	title: z.string().nullable().optional(),
	description: z.string().nullable().optional(),
	color: z.number(), // resolved int (BE has already applied the blurple fallback)
	footer: z.string().nullable().optional(),
	imageUrl: z.string().nullable().optional(),
});
export type RenderedEmbed = z.infer<typeof RenderedEmbedSchema>;

export const CommandPreviewSchema = camelObject({
	renderedText: z.string().nullable().optional(),
	renderedEmbed: RenderedEmbedSchema.nullable().optional(),
	placeholders: z.array(PlaceholderInfoSchema),
});
export type CommandPreview = z.infer<typeof CommandPreviewSchema>;
export const toCommandPreview = (raw: unknown): CommandPreview =>
	CommandPreviewSchema.parse(raw);

export type CommandPreviewInput = {
	responseType: "text" | "embed";
	responseText?: string | null;
	embed?: EmbedSpec | null;
};
