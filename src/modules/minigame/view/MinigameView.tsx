import { Box, Heading, VStack } from "@chakra-ui/react";
import { useParams } from "@tanstack/react-router";
import type { ReactElement } from "react";
import { MinigameSettingsForm } from "@/modules/minigame/components/MinigameSettingsForm";

export function MinigameView(): ReactElement {
	const { guildId } = useParams({ from: "/dashboard/$guildId/minigames" });

	return (
		<VStack align="stretch" spacing={8}>
			<Heading size="md">Mini-games</Heading>

			<Box bg="bg.surface" borderRadius="2xl" boxShadow="sm" p={6}>
				<MinigameSettingsForm guildId={guildId} />
			</Box>
		</VStack>
	);
}
