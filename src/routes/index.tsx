import { createFileRoute, redirect } from "@tanstack/react-router";
import { getRepositories } from "@/di/repositories.instance";
import { LandingView } from "@/modules/authentication/view/LandingView";

export const Route = createFileRoute("/")({
	beforeLoad: async () => {
		try {
			await getRepositories().auth.getMe();
		} catch {
			// Not authenticated (401) → render the landing/login page.
			return;
		}
		// Authenticated → go to the dashboard. Thrown OUTSIDE the try so the
		// redirect (a TanStack `Response`, whose target lives under `.options`,
		// not a top-level `to`) propagates to the router instead of being
		// caught and swallowed here.
		// eslint-disable-next-line @typescript-eslint/only-throw-error
		throw redirect({ to: "/dashboard" });
	},
	component: LandingView,
});
