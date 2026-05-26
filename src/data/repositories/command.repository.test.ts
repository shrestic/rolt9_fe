import { describe, it, expect } from "vitest";
import { makeCommandRepository } from "./command.repository";

describe("command.repository", () => {
	it("maps command list to camelCase", async () => {
		const repo = makeCommandRepository({
			// eslint-disable-next-line @typescript-eslint/require-await
			list: async () => [
				{
					id: "c1",
					trigger: "rules",
					// eslint-disable-next-line camelcase
					response_type: "text",
					// eslint-disable-next-line camelcase
					response_text: "hi",
					embed: null,
					// eslint-disable-next-line camelcase
					allowed_role_ids: [],
					// eslint-disable-next-line camelcase
					allowed_channel_ids: [],
					// eslint-disable-next-line camelcase
					cooldown_seconds: 0,
					enabled: true,
				},
			],
			// eslint-disable-next-line @typescript-eslint/require-await
			create: async () => ({}),
			// eslint-disable-next-line @typescript-eslint/require-await
			update: async () => ({}),
			// eslint-disable-next-line @typescript-eslint/require-await
			remove: async () => undefined,
			// eslint-disable-next-line @typescript-eslint/require-await
			getSettings: async () => ({}),
			// eslint-disable-next-line @typescript-eslint/require-await
			updateSettings: async () => ({}),
			// eslint-disable-next-line @typescript-eslint/require-await
			preview: async () => ({}),
		});
		const cmds = await repo.list("g");
		expect(cmds[0]?.trigger).toBe("rules");
		expect(cmds[0]?.responseType).toBe("text");
	});

	it("forwards preview payload + parses rendered output", async () => {
		const received: { responseType?: string } = {};
		const repo = makeCommandRepository({
			// eslint-disable-next-line @typescript-eslint/require-await
			list: async () => [],
			// eslint-disable-next-line @typescript-eslint/require-await
			create: async () => ({}),
			// eslint-disable-next-line @typescript-eslint/require-await
			update: async () => ({}),
			// eslint-disable-next-line @typescript-eslint/require-await
			remove: async () => undefined,
			// eslint-disable-next-line @typescript-eslint/require-await
			getSettings: async () => ({}),
			// eslint-disable-next-line @typescript-eslint/require-await
			updateSettings: async () => ({}),
			// eslint-disable-next-line @typescript-eslint/require-await
			preview: async (_guild, input) => {
				received.responseType = input.responseType;
				return JSON.parse(
					'{"rendered_text":"Hi alice","rendered_embed":null,' +
						'"placeholders":[{"name":"user","description":"d","example":"alice"}]}'
				);
			},
		});
		const out = await repo.preview("g", {
			responseType: "text",
			responseText: "Hi {user}",
			embed: null,
		});
		expect(received.responseType).toBe("text");
		expect(out.renderedText).toBe("Hi alice");
		expect(out.placeholders[0]?.example).toBe("alice");
	});
});
