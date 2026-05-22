/* eslint-disable camelcase */
import { describe, it, expect } from "vitest";
import { z } from "zod";
import { camelObject } from "./zod";

const Sample = camelObject({
	discordId: z.string(),
	iconUrl: z.string().nullable(),
});

describe("camelObject", () => {
	it("camelizes snake_case keys then validates", () => {
		expect(Sample.parse({ discord_id: "1", icon_url: null })).toEqual({
			discordId: "1",
			iconUrl: null,
		});
	});

	it("throws on an invalid shape", () => {
		expect(() => Sample.parse({ discord_id: 1, icon_url: null })).toThrow();
	});
});
