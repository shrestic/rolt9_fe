import { createFileRoute } from "@tanstack/react-router";
import { GuildDetailView } from "@/modules/guilds/view/GuildDetailView";

export const Route = createFileRoute("/dashboard/$guildId")({
	component: GuildDetailView,
});
