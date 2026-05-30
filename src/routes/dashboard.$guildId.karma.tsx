import { createFileRoute } from "@tanstack/react-router";
import { KarmaView } from "@/modules/karma/view/KarmaView";

export const Route = createFileRoute("/dashboard/$guildId/karma")({
	component: KarmaView,
});
