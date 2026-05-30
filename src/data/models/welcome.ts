import { z } from "zod";
import { camelObject } from "@/utils/zod";

// Welcome plugin settings. Wire is snake_case; camelObject converts.
export const WelcomeSettingsSchema = camelObject({
	enabled: z.boolean(),
	channelId: z.string().nullable(),
	welcomeTemplate: z.string(),
	aiWelcome: z.boolean(),
	leaveEnabled: z.boolean(),
	leaveTemplate: z.string(),
});
export type WelcomeSettings = z.infer<typeof WelcomeSettingsSchema>;
export const toWelcomeSettings = (raw: unknown): WelcomeSettings =>
	WelcomeSettingsSchema.parse(raw);

export type WelcomeSettingsInput = {
	enabled: boolean;
	channelId: string | null;
	welcomeTemplate: string;
	aiWelcome: boolean;
	leaveEnabled: boolean;
	leaveTemplate: string;
};
