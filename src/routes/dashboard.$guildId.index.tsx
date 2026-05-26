import { createFileRoute } from "@tanstack/react-router";
import { GuildOverviewView } from "@/modules/guilds/view/GuildOverviewView";

export const Route = createFileRoute("/dashboard/$guildId/")({
	component: GuildOverviewView,
});
