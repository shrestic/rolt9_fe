import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
	createMemoryHistory,
	createRootRoute,
	createRoute,
	createRouter,
	Outlet,
	RouterProvider,
} from "@tanstack/react-router";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import { CommandForm } from "./CommandForm";
import { RepositoriesProvider } from "@/di/RepositoriesProvider";
import type { Repositories } from "@/di/types";

// Minimal mock command repository — preview just echoes a stub so the form
// can render without exploding. Mutations aren't exercised in these tests.
const makeMockRepos = (): Repositories => ({
	auth: {} as Repositories["auth"],
	guild: {} as Repositories["guild"],
	moderation: {} as Repositories["moderation"],
	command: {
		// eslint-disable-next-line @typescript-eslint/require-await
		list: async () => [],
		// eslint-disable-next-line @typescript-eslint/require-await
		create: async () => ({
			id: "x",
			trigger: "x",
			responseType: "text",
			responseText: null,
			embed: null,
			allowedRoleIds: [],
			allowedChannelIds: [],
			cooldownSeconds: 0,
			enabled: true,
		}),
		// eslint-disable-next-line @typescript-eslint/require-await
		update: async () => ({
			id: "x",
			trigger: "x",
			responseType: "text",
			responseText: null,
			embed: null,
			allowedRoleIds: [],
			allowedChannelIds: [],
			cooldownSeconds: 0,
			enabled: true,
		}),
		// eslint-disable-next-line @typescript-eslint/require-await
		remove: async () => undefined,
		// eslint-disable-next-line @typescript-eslint/require-await
		getSettings: async () => ({ prefix: "!", enabled: true }),
		// eslint-disable-next-line @typescript-eslint/require-await
		updateSettings: async () => ({ prefix: "!", enabled: true }),
		// eslint-disable-next-line @typescript-eslint/require-await
		preview: async () => ({
			renderedText: "rendered",
			renderedEmbed: null,
			placeholders: [],
		}),
	},
	leveling: {} as Repositories["leveling"],
	currency: {} as Repositories["currency"],
	badges: {} as Repositories["badges"],
	quests: {} as Repositories["quests"],
	pet: {} as Repositories["pet"],
	karma: {} as Repositories["karma"],
	minigame: {} as Repositories["minigame"],
	ai: {} as Repositories["ai"],
	welcome: {} as Repositories["welcome"],
});

// Render CommandForm inside the providers it expects:
//   - TanStack Router with the `/dashboard/$guildId/commands` route so
//     `useParams({ from: "/dashboard/$guildId/commands" })` resolves
//   - QueryClient for usePreviewCommand
//   - RepositoriesProvider with mocked repos
const renderForm = async (
	ui: ReactNode
): Promise<ReturnType<typeof render>> => {
	const rootRoute = createRootRoute({ component: () => <Outlet /> });
	const commandsRoute = createRoute({
		getParentRoute: () => rootRoute,
		path: "/dashboard/$guildId/commands",
		component: () => <>{ui}</>,
	});
	const router = createRouter({
		routeTree: rootRoute.addChildren([commandsRoute]),
		history: createMemoryHistory({
			initialEntries: ["/dashboard/123/commands"],
		}),
	});
	const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
	const result = render(
		<QueryClientProvider client={qc}>
			<RepositoriesProvider value={makeMockRepos()}>
				<RouterProvider router={router} />
			</RepositoriesProvider>
		</QueryClientProvider>
	);
	await router.load();
	return result;
};

describe("CommandForm", () => {
	it("requires a trigger", async () => {
		const onSubmit = vi.fn();
		await renderForm(
			<CommandForm
				channels={[]}
				roles={[]}
				onCancel={() => {}}
				onSubmit={onSubmit}
			/>
		);
		fireEvent.click(screen.getByRole("button", { name: /save/i }));
		await waitFor(() => {
			expect(screen.getByText(/trigger is required/i)).toBeInTheDocument();
		});
		expect(onSubmit).not.toHaveBeenCalled();
	});

	it("submits a text command", async () => {
		const onSubmit = vi.fn();
		await renderForm(
			<CommandForm
				channels={[]}
				roles={[]}
				onCancel={() => {}}
				onSubmit={onSubmit}
			/>
		);
		fireEvent.change(screen.getByLabelText(/trigger/i), {
			target: { value: "rules" },
		});
		fireEvent.change(screen.getByLabelText(/response text/i), {
			target: { value: "Be nice {user}" },
		});
		fireEvent.click(screen.getByRole("button", { name: /save/i }));
		await waitFor(() => {
			expect(onSubmit).toHaveBeenCalled();
		});
		expect(onSubmit.mock.calls[0]?.[0]).toMatchObject({
			trigger: "rules",
			responseType: "text",
			responseText: "Be nice {user}",
		});
	});

	it("submits an edited cooldown as a number (regression: number input must coerce)", async () => {
		const onSubmit = vi.fn();
		await renderForm(
			<CommandForm
				channels={[]}
				roles={[]}
				onCancel={() => {}}
				onSubmit={onSubmit}
			/>
		);
		fireEvent.change(screen.getByLabelText(/trigger/i), {
			target: { value: "rules" },
		});
		fireEvent.change(screen.getByLabelText(/response text/i), {
			target: { value: "hi" },
		});
		fireEvent.change(screen.getByLabelText(/cooldown/i), {
			target: { value: "30" },
		});
		fireEvent.click(screen.getByRole("button", { name: /save/i }));
		await waitFor(() => {
			expect(onSubmit).toHaveBeenCalled();
		});
		expect(onSubmit.mock.calls[0]?.[0]).toMatchObject({ cooldownSeconds: 30 });
	});
});
