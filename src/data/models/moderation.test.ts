import { describe, it, expect } from "vitest";
import { toCasesPage, toModerationSettings } from "./moderation";

describe("moderation models", () => {
	it("parses settings with snake keys", () => {
		const raw = JSON.parse(
			'{"mod_log_channel_id":"123","dm_on_action":false,' +
				'"warn_escalation":[{"threshold":3,"action":"mute","duration_seconds":3600}]}'
		);
		const s = toModerationSettings(raw);
		expect(s.modLogChannelId).toBe("123");
		expect(s.dmOnAction).toBe(false);
		expect(s.warnEscalation[0]?.durationSeconds).toBe(3600);
	});

	it("parses a cases page", () => {
		const raw = JSON.parse(
			'{"items":[{"case_number":1,"action":"warn","source":"manual",' +
				'"target_user_id":"7","target_username":"x","moderator_user_id":"8",' +
				'"moderator_username":"m","reason":null,"duration_seconds":null,' +
				'"created_at":"2026-01-01T00:00:00Z","active":true}],' +
				'"total":1,"page":1,"page_size":20}'
		);
		const p = toCasesPage(raw);
		expect(p.total).toBe(1);
		expect(p.items[0]?.caseNumber).toBe(1);
		expect(p.pageSize).toBe(20);
	});
});
