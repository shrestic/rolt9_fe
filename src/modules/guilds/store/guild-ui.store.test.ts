import { describe, it, expect, beforeEach } from "vitest";
import { useGuildUiStore } from "./guild-ui.store";

describe("guild-ui store", () => {
	beforeEach(() => {
		useGuildUiStore.setState({ invitePolling: false });
	});

	it("toggles invite polling on and off", () => {
		useGuildUiStore.getState().startInvitePolling();
		expect(useGuildUiStore.getState().invitePolling).toBe(true);
		useGuildUiStore.getState().stopInvitePolling();
		expect(useGuildUiStore.getState().invitePolling).toBe(false);
	});
});
