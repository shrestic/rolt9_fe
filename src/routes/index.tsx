import { createFileRoute, redirect } from "@tanstack/react-router";
import { getRepositories } from "@/di/repositories.instance";
import { LandingView } from "@/modules/authentication/view/LandingView";

export const Route = createFileRoute("/")({
	beforeLoad: async () => {
		try {
			await getRepositories().auth.getMe();
			// eslint-disable-next-line @typescript-eslint/only-throw-error
			throw redirect({ to: "/dashboard" });
		} catch (error) {
			// If `error` is a redirect, re-throw it so TSR handles it.
			// Any other error (e.g. 401) → not logged in → render landing.
			if (error && typeof error === "object" && "to" in error) throw error;
		}
	},
	component: LandingView,
});
