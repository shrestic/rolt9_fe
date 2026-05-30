import { createFileRoute } from "@tanstack/react-router";
import { QuestsView } from "@/modules/quests/view/QuestsView";

export const Route = createFileRoute("/dashboard/$guildId/quests")({
	component: QuestsView,
});
