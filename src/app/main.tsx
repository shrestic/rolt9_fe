import { createRouter } from "@tanstack/react-router";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import { routeTree } from "../routeTree.gen";
import { config } from "@/settings/config";
import "@/styles/tailwind.css";
import "@/utils/i18n";

const router = createRouter({ routeTree });

export type TanstackRouter = typeof router;

declare module "@tanstack/react-router" {
	interface Register {
		router: TanstackRouter;
	}
}

async function enableMocking(): Promise<void> {
	if (!config.useMsw) return;
	const { worker } = await import("@/data/mock/browser");
	await worker.start({ onUnhandledRequest: "bypass" });
}

const rootElement = document.querySelector("#root") as Element;

void enableMocking().then(() => {
	if (!rootElement.innerHTML) {
		createRoot(rootElement).render(
			<StrictMode>
				<App router={router} />
			</StrictMode>
		);
	}
});
