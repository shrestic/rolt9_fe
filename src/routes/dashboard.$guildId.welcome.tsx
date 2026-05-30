import { createFileRoute } from "@tanstack/react-router";
import { WelcomeView } from "@/modules/welcome/view/WelcomeView";

export const Route = createFileRoute("/dashboard/$guildId/welcome")({
	component: WelcomeView,
});
