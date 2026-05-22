import { RouterProvider } from "@tanstack/react-router";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import type { ReactElement } from "react";
import { AppProviders } from "./AppProviders";
import { TanStackRouterDevelopmentTools } from "@/components/development-tools/TanStackRouterDevelopmentTools";
import type { TanstackRouter } from "./main";

export const App = ({ router }: { router: TanstackRouter }): ReactElement => (
	<AppProviders>
		<RouterProvider router={router} />
		<TanStackRouterDevelopmentTools
			initialIsOpen={false}
			position="bottom-left"
			router={router}
		/>
		<ReactQueryDevtools initialIsOpen={false} position="bottom" />
	</AppProviders>
);
