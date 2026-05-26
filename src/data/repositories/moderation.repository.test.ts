import { describe, it, expect, vi } from "vitest";
import { makeModerationRepository } from "./moderation.repository";

describe("moderation.repository", () => {
	it("maps settings response to camelCase", async () => {
		const repo = makeModerationRepository({
			// eslint-disable-next-line @typescript-eslint/require-await
			getSettings: async () =>
				// eslint-disable-next-line camelcase
				({ mod_log_channel_id: "1", dm_on_action: true, warn_escalation: [] }),
			// eslint-disable-next-line @typescript-eslint/require-await
			updateSettings: async () => ({}),
			// eslint-disable-next-line @typescript-eslint/require-await
			listCases: async () => ({}),
			// eslint-disable-next-line @typescript-eslint/require-await
			deactivateCase: async () => ({}),
		});
		const s = await repo.getSettings("g");
		expect(s.modLogChannelId).toBe("1");
	});

	it("delegates deactivateCase", async () => {
		const spy = vi.fn().mockResolvedValue({});
		const repo = makeModerationRepository({
			// eslint-disable-next-line @typescript-eslint/require-await
			getSettings: async () => ({}),
			// eslint-disable-next-line @typescript-eslint/require-await
			updateSettings: async () => ({}),
			// eslint-disable-next-line @typescript-eslint/require-await
			listCases: async () => ({}),
			deactivateCase: spy,
		});
		await repo.deactivateCase("g", 4);
		expect(spy).toHaveBeenCalledWith("g", 4);
	});
});
