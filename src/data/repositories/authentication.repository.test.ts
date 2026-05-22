import { describe, it, expect } from "vitest";
import { makeAuthenticationRepository } from "./authentication.repository";
import { UnauthorizedException } from "@/data/exception/authentication.exception";

describe("authentication.repository", () => {
	it("maps the /me payload to a User", async () => {
		const repo = makeAuthenticationRepository({
			// eslint-disable-next-line @typescript-eslint/require-await
			getMe: async () => ({
				id: "u1",
				// eslint-disable-next-line camelcase
				discord_id: 1,
				username: "dev",
				// eslint-disable-next-line camelcase
				avatar_url: null,
			}),
			logout: async () => {},
		});
		await expect(repo.getMe()).resolves.toEqual({
			id: "u1",
			discordId: 1,
			username: "dev",
			avatarUrl: null,
		});
	});

	it("throws UnauthorizedException on a 401", async () => {
		const repo = makeAuthenticationRepository({
			// eslint-disable-next-line @typescript-eslint/require-await
			getMe: async () => {
				// eslint-disable-next-line @typescript-eslint/only-throw-error
				throw { isAxiosError: true, response: { status: 401 } };
			},
			logout: async () => {},
		});
		await expect(repo.getMe()).rejects.toBeInstanceOf(UnauthorizedException);
	});

	it("delegates logout to the remote", async () => {
		let called = false;
		const repo = makeAuthenticationRepository({
			// eslint-disable-next-line @typescript-eslint/require-await
			getMe: async () => ({}),
			// eslint-disable-next-line @typescript-eslint/require-await
			logout: async () => {
				called = true;
			},
		});
		await repo.logout();
		expect(called).toBe(true);
	});
});
