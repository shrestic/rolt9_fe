import { z } from "zod";
import { camelObject } from "@/utils/zod";

// ---------------------------------------------------------------------------
// Quest model
// ---------------------------------------------------------------------------
// The wire format is snake_case (e.g. objective_type, reward_coins).
// `camelObject` runs the raw payload through objectToCamel before validating,
// so here we describe the already-camelCased shape (objectiveType, rewardCoins, ...).
export const QuestSchema = camelObject({
	// Unique identifier assigned by the backend.
	id: z.string(),
	// Display name for the quest, e.g. "Daily Earner".
	name: z.string(),
	// Optional description shown on the quest card — null if not set.
	description: z.string().nullable(),
	// How often the quest resets: "daily" or "weekly".
	period: z.enum(["daily", "weekly"]),
	// What the member must do to complete the quest.
	// "earn_coins" — accumulate coins via chat; "daily_claim" — use /daily.
	objectiveType: z.enum(["earn_coins", "daily_claim"]),
	// How many units (coins earned, or claims made) required to complete.
	target: z.number().int(),
	// Coins granted when the quest is completed.
	rewardCoins: z.number().int(),
	// Whether the quest is active and shown to members.
	enabled: z.boolean(),
});
export type Quest = z.infer<typeof QuestSchema>;

// Parse a raw unknown payload into a validated Quest.
export const toQuest = (raw: unknown): Quest => QuestSchema.parse(raw);

// Parse a raw unknown payload into a validated array of Quests.
export const toQuests = (raw: unknown): Array<Quest> =>
	z.array(QuestSchema).parse(raw);

// ---------------------------------------------------------------------------
// Quest input (used for create + update mutations)
// ---------------------------------------------------------------------------
// Kept as a separate plain type so the mutation contract is explicit and never
// coupled to the zod schema — the same pattern as CurrencySettingsInput.
export type QuestInput = {
	name: string;
	description: string | null;
	period: "daily" | "weekly";
	// objectiveType is camelCase here; objectToSnake converts it before sending.
	objectiveType: "earn_coins" | "daily_claim";
	target: number;
	rewardCoins: number;
	enabled: boolean;
};
