import { createRouter } from "@tanstack/react-router";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import { routeTree } from "../routeTree.gen";
import { config } from "@/settings/config";
import { canonicalHostRedirect } from "@/utils/host";
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

// The session cookie is host-scoped to the API's host (localhost). Opening the
// app on 127.0.0.1 or a LAN IP means that cookie is never sent -> endless
// Discord login loop. In dev, send the browser to the canonical host first.
const redirectTo = import.meta.env.DEV
	? canonicalHostRedirect(window.location)
	: null;

if (redirectTo) {
	window.location.replace(redirectTo);
} else {
	void enableMocking().then(() => {
		if (!rootElement.innerHTML) {
			createRoot(rootElement).render(
				<StrictMode>
					<App router={router} />
				</StrictMode>
			);
		}
	});
}
