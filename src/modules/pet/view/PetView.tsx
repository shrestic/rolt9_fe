import { Heading, VStack } from "@chakra-ui/react";
import { useParams } from "@tanstack/react-router";
import type { ReactElement } from "react";
import { PetSettingsForm } from "@/modules/pet/components/PetSettingsForm";
import { PetStatusCard } from "@/modules/pet/components/PetStatusCard";

export function PetView(): ReactElement {
	const { guildId } = useParams({ from: "/dashboard/$guildId/pet" });

	return (
		<VStack align="stretch" spacing={8}>
			<Heading size="md">Pet</Heading>

			{/* Live status card — shows the pet's current stats at a glance. */}
			<PetStatusCard guildId={guildId} />

			{/* Settings form — lets admins configure pet behaviour. */}
			<PetSettingsForm guildId={guildId} />
		</VStack>
	);
}
