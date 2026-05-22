import { z } from "zod";
import { camelObject } from "@/utils/zod";

export const UserSchema = camelObject({
	id: z.string(),
	discordId: z.number(),
	username: z.string(),
	avatarUrl: z.string().nullable(),
});

export type User = z.infer<typeof UserSchema>;

export const toUser = (raw: unknown): User => UserSchema.parse(raw);
