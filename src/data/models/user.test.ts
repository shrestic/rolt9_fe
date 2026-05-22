import { describe, it, expect } from "vitest";
import { z } from "zod";
import { toUser } from "./user";

describe("toUser", () => {
	it("maps a snake_case /me payload to a camelCase User", () => {
		// eslint-disable-next-line camelcase
		const raw = { id: "u1", discord_id: 1, username: "dev", avatar_url: null };
		expect(toUser(raw)).toEqual({
			id: "u1",
			discordId: 1,
			username: "dev",
			avatarUrl: null,
		});
	});

	it("throws on a malformed payload", () => {
		expect(() => toUser({ id: "u1" })).toThrow(z.ZodError);
	});
});
