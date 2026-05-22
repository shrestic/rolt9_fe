import { describe, it, expect } from "vitest";
import { makeGuildRepository } from "./guild.repository";
import { ForbiddenException } from "@/data/exception/guild.exception";

describe("guild.repository", () => {
	it("maps the guild list", async () => {
		const repo = makeGuildRepository({
			// eslint-disable-next-line @typescript-eslint/require-await
			getMyGuilds: async () => [
				{
					// eslint-disable-next-line camelcase
					discord_id: "1",
					name: "A",
					// eslint-disable-next-line camelcase
					icon_url: null,
					// eslint-disable-next-line camelcase
					bot_present: true,
					// eslint-disable-next-line camelcase
					can_manage: true,
				},
			],
			// eslint-disable-next-line @typescript-eslint/require-await
			getOverview: async () => ({}),
		});
		await expect(repo.getMyGuilds()).resolves.toEqual([
			{
				discordId: "1",
				name: "A",
				iconUrl: null,
				botPresent: true,
				canManage: true,
			},
		]);
	});

	it("throws ForbiddenException on a 403", async () => {
		const repo = makeGuildRepository({
			// eslint-disable-next-line @typescript-eslint/require-await
			getMyGuilds: async () => [],
			// eslint-disable-next-line @typescript-eslint/require-await
			getOverview: async () => {
				// eslint-disable-next-line @typescript-eslint/only-throw-error
				throw { isAxiosError: true, response: { status: 403 } };
			},
		});
		await expect(repo.getOverview("1")).rejects.toBeInstanceOf(
			ForbiddenException
		);
	});
});
