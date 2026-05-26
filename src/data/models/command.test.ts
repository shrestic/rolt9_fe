import { describe, it, expect } from "vitest";
import { toCommandPreview, toCommandSettings, toCommands } from "./command";

describe("command models", () => {
	it("parses a command list with snake keys", () => {
		const raw = JSON.parse(
			'[{"id":"c1","trigger":"rules","response_type":"text","response_text":"hi",' +
				'"embed":null,"allowed_role_ids":["1"],"allowed_channel_ids":[],' +
				'"cooldown_seconds":5,"enabled":true}]'
		);
		const cmds = toCommands(raw);
		expect(cmds[0]?.trigger).toBe("rules");
		expect(cmds[0]?.cooldownSeconds).toBe(5);
		expect(cmds[0]?.allowedRoleIds).toEqual(["1"]);
	});

	it("parses an embed command", () => {
		const raw = JSON.parse(
			'[{"id":"c2","trigger":"info","response_type":"embed","response_text":null,' +
				'"embed":{"title":"T","description":"D","color":"#fff","image_url":null,"footer":null},' +
				'"allowed_role_ids":[],"allowed_channel_ids":[],"cooldown_seconds":0,"enabled":true}]'
		);
		expect(toCommands(raw)[0]?.embed?.title).toBe("T");
	});

	it("parses command settings", () => {
		expect(
			toCommandSettings(JSON.parse('{"prefix":"?","enabled":true}')).prefix
		).toBe("?");
	});

	it("parses text preview response", () => {
		const raw = JSON.parse(
			'{"rendered_text":"hi alice","rendered_embed":null,' +
				'"placeholders":[{"name":"user","description":"d","example":"alice"}]}'
		);
		const preview = toCommandPreview(raw);
		expect(preview.renderedText).toBe("hi alice");
		expect(preview.renderedEmbed).toBeNull();
		expect(preview.placeholders[0]?.example).toBe("alice");
	});

	it("parses embed preview response with resolved int color", () => {
		const raw = JSON.parse(
			'{"rendered_text":null,"rendered_embed":' +
				'{"title":"T","description":"D","color":16711680,"footer":null,"image_url":null},' +
				'"placeholders":[]}'
		);
		const preview = toCommandPreview(raw);
		expect(preview.renderedEmbed?.color).toBe(0xff0000);
	});
});
