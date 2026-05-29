import { createFileRoute } from "@tanstack/react-router";
import { LevelingView } from "@/modules/leveling/view/LevelingView";

export const Route = createFileRoute("/dashboard/$guildId/leveling")({
	component: LevelingView,
});
