import { createFileRoute } from "@tanstack/react-router";
import { ModerationView } from "@/modules/moderation/view/ModerationView";

export const Route = createFileRoute("/dashboard/$guildId/moderation")({
	component: ModerationView,
});
