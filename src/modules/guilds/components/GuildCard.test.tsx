import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import {
	createMemoryHistory,
	createRouter,
	RouterProvider,
	createRoute,
	createRootRoute,
	Outlet,
} from "@tanstack/react-router";
import { GuildCard } from "./GuildCard";
import type { GuildSummary } from "@/data/models/guild";

const renderWithRouter = async (
	ui: React.ReactNode
): Promise<ReturnType<typeof render>> => {
	const rootRoute = createRootRoute({ component: () => <Outlet /> });
	const homeRoute = createRoute({
		getParentRoute: () => rootRoute,
		path: "/",
		component: () => <>{ui}</>,
	});
	const dashboardRoute = createRoute({
		getParentRoute: () => rootRoute,
		path: "dashboard/$guildId",
		component: () => null,
	});
	const router = createRouter({
		routeTree: rootRoute.addChildren([homeRoute, dashboardRoute]),
		history: createMemoryHistory({ initialEntries: ["/"] }),
	});
	const result = render(<RouterProvider router={router} />);
	await router.load();
	return result;
};

const present: GuildSummary = {
	discordId: "1",
	name: "A",
	iconUrl: null,
	botPresent: true,
	canManage: true,
};
const absent: GuildSummary = { ...present, discordId: "2", botPresent: false };

describe("GuildCard", () => {
	test("renders Configure when bot is present", async () => {
		await renderWithRouter(
			<GuildCard guild={present} onInviteStart={() => {}} />
		);
		await waitFor(() => {
			expect(
				screen.getByRole("link", { name: /configure/i })
			).toBeInTheDocument();
		});
	});

	test("renders Add bot button when bot is absent and triggers callback + window.open", async () => {
		const fn = vi.fn();
		const openSpy = vi.spyOn(window, "open").mockImplementation(() => null);
		await renderWithRouter(<GuildCard guild={absent} onInviteStart={fn} />);
		await waitFor(() => {
			expect(
				screen.getByRole("button", { name: /add bot/i })
			).toBeInTheDocument();
		});
		fireEvent.click(screen.getByRole("button", { name: /add bot/i }));
		expect(fn).toHaveBeenCalled();
		expect(openSpy).toHaveBeenCalled();
		openSpy.mockRestore();
	});
});
