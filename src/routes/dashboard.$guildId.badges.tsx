import { createFileRoute } from "@tanstack/react-router";
import { BadgesView } from "@/modules/badges/view/BadgesView";

export const Route = createFileRoute("/dashboard/$guildId/badges")({
	component: BadgesView,
});
