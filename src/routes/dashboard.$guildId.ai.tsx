import { createFileRoute } from "@tanstack/react-router";
import { AiView } from "@/modules/ai/view/AiView";

export const Route = createFileRoute("/dashboard/$guildId/ai")({
	component: AiView,
});
