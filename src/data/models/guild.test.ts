import { describe, it, expect } from "vitest";
import { z } from "zod";
import { toGuildSummaries, toGuildOverview } from "./guild";

describe("guild models", () => {
	it("maps a list of guild summaries", () => {
		const raw = [
			{
				// eslint-disable-next-line camelcase
				discord_id: "100",
				name: "A",
				// eslint-disable-next-line camelcase
				icon_url: null,
				// eslint-disable-next-line camelcase
				bot_present: true,
				// eslint-disable-next-line camelcase
				can_manage: true,
			},
		];
		expect(toGuildSummaries(raw)).toEqual([
			{
				discordId: "100",
				name: "A",
				iconUrl: null,
				botPresent: true,
				canManage: true,
			},
		]);
	});

	it("maps a guild overview with nested channels and roles", () => {
		const raw = {
			// eslint-disable-next-line camelcase
			discord_id: "100",
			name: "A",
			// eslint-disable-next-line camelcase
			icon_url: null,
			// eslint-disable-next-line camelcase
			member_count: 7,
			channels: [{ id: "1", name: "general", type: 0 }],
			roles: [{ id: "1", name: "@everyone" }],
			// eslint-disable-next-line camelcase
			bot_present: true,
		};
		expect(toGuildOverview(raw)).toEqual({
			discordId: "100",
			name: "A",
			iconUrl: null,
			memberCount: 7,
			channels: [{ id: "1", name: "general", type: 0 }],
			roles: [{ id: "1", name: "@everyone" }],
			botPresent: true,
		});
	});

	it("throws on a malformed overview", () => {
		// eslint-disable-next-line camelcase
		expect(() => toGuildOverview({ discord_id: "100" })).toThrow(z.ZodError);
	});
});
