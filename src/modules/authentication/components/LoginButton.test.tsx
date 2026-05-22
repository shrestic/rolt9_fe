import { render, screen, fireEvent } from "@testing-library/react";
import { describe, test, expect, vi, afterEach } from "vitest";
import { LoginButton } from "./LoginButton";

const originalLocation = window.location;

afterEach(() => {
	// @ts-expect-error reset
	window.location = originalLocation;
});

describe("LoginButton", () => {
	test("redirects to backend login URL on click", () => {
		const assign = vi.fn();
		// @ts-expect-error mock
		window.location = { assign };
		render(<LoginButton />);
		fireEvent.click(
			screen.getByRole("button", { name: /login with discord/i })
		);
		expect(assign).toHaveBeenCalledWith(
			expect.stringContaining("/auth/discord/login")
		);
	});
});
