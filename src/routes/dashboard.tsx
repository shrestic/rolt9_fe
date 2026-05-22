import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { getRepositories } from "@/di/repositories.instance";
import { RootView } from "@/modules/root/RootView";

export const Route = createFileRoute("/dashboard")({
	beforeLoad: async () => {
		try {
			await getRepositories().auth.getMe();
		} catch {
			// eslint-disable-next-line @typescript-eslint/only-throw-error
			throw redirect({ to: "/" });
		}
	},
	component: () => (
		<RootView>
			<Outlet />
		</RootView>
	),
});
