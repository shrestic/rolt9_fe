import { createFileRoute } from "@tanstack/react-router";
import { PetView } from "@/modules/pet/view/PetView";

export const Route = createFileRoute("/dashboard/$guildId/pet")({
	component: PetView,
});
