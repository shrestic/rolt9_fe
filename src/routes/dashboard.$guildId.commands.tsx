import { createFileRoute } from "@tanstack/react-router";
import { CommandsView } from "@/modules/commands/view/CommandsView";

export const Route = createFileRoute("/dashboard/$guildId/commands")({
	component: CommandsView,
});
