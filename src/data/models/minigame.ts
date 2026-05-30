import { z } from "zod";
import { camelObject } from "@/utils/zod";

// Mini-games settings. House edge is fixed in the backend code; only the
// on/off switch and bet bounds are tunable. Wire format is snake_case;
// `camelObject` converts to the camelCase shape described here.
export const MinigameSettingsSchema = camelObject({
	enabled: z.boolean(),
	minBet: z.number().int(),
	maxBet: z.number().int(),
});
export type MinigameSettings = z.infer<typeof MinigameSettingsSchema>;
export const toMinigameSettings = (raw: unknown): MinigameSettings =>
	MinigameSettingsSchema.parse(raw);

// Shape sent back to the API (objectToSnake converts it to snake_case).
export type MinigameSettingsInput = {
	enabled: boolean;
	minBet: number;
	maxBet: number;
};
