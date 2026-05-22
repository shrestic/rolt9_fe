import { createFileRoute } from "@tanstack/react-router";
import { ServerPickerView } from "@/modules/guilds/view/ServerPickerView";

export const Route = createFileRoute("/dashboard/")({
	component: ServerPickerView,
});
