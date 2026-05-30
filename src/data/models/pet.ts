import { z } from "zod";
import { camelObject } from "@/utils/zod";

// ---------------------------------------------------------------------------
// Pet settings
// ---------------------------------------------------------------------------
// Wire format is snake_case (e.g. feed_cost); camelObject normalises before
// validation so all fields here are already in camelCase.
export const PetSettingsSchema = camelObject({
	// Master toggle; when false the pet system is completely disabled.
	enabled: z.boolean(),
	// Display name of the guild's pet.
	name: z.string(),
	// Amount of currency that must be spent to feed the pet once.
	feedCost: z.number().int(),
	// Hunger points restored per feed action.
	feedAmount: z.number().int(),
	// Happiness points restored per play action.
	playAmount: z.number().int(),
	// Hunger/happiness points lost per calendar day of inactivity.
	decayPerDay: z.number().int(),
});
export type PetSettings = z.infer<typeof PetSettingsSchema>;
export const toPetSettings = (raw: unknown): PetSettings =>
	PetSettingsSchema.parse(raw);

// Shape used when sending settings back to the API. Kept separate from the
// zod schema type so the mutation contract is explicit and not coupled to zod.
export type PetSettingsInput = {
	enabled: boolean;
	name: string;
	feedCost: number;
	feedAmount: number;
	playAmount: number;
	decayPerDay: number;
};

// ---------------------------------------------------------------------------
// Pet status (read-only, real-time state of the pet)
// ---------------------------------------------------------------------------
export const PetStatusSchema = camelObject({
	// Current display name (may differ from settings if renamed mid-session).
	name: z.string(),
	// Hunger level 0-100; 0 = starving, 100 = full.
	hunger: z.number().int(),
	// Happiness level 0-100; 0 = miserable, 100 = ecstatic.
	happiness: z.number().int(),
	// Total XP accumulated by the pet.
	xp: z.number().int(),
	// Current level derived from xp.
	level: z.number().int(),
	// Human-readable lifecycle stage (e.g. "Baby", "Teen", "Adult").
	stageName: z.string(),
	// Emoji representing the current lifecycle stage.
	stageEmoji: z.string(),
	// Emoji representing the pet's current mood.
	moodEmoji: z.string(),
	// Whether the pet system is enabled for this guild.
	enabled: z.boolean(),
});
export type PetStatus = z.infer<typeof PetStatusSchema>;
export const toPetStatus = (raw: unknown): PetStatus =>
	PetStatusSchema.parse(raw);
