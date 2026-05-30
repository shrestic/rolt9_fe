import { createFileRoute } from "@tanstack/react-router";
import { MinigameView } from "@/modules/minigame/view/MinigameView";

export const Route = createFileRoute("/dashboard/$guildId/minigames")({
	component: MinigameView,
});
