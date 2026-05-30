import { Box, Heading, VStack } from "@chakra-ui/react";
import { useParams } from "@tanstack/react-router";
import type { ReactElement } from "react";
import { AiSettingsForm } from "@/modules/ai/components/AiSettingsForm";
import { KbManager } from "@/modules/ai/components/KbManager";

export function AiView(): ReactElement {
	const { guildId } = useParams({ from: "/dashboard/$guildId/ai" });

	return (
		<VStack align="stretch" spacing={8}>
			<Heading size="md">AI</Heading>

			<Box bg="bg.surface" borderRadius="2xl" boxShadow="sm" p={6}>
				<AiSettingsForm guildId={guildId} />
			</Box>

			<Box bg="bg.surface" borderRadius="2xl" boxShadow="sm" p={6}>
				<KbManager guildId={guildId} />
			</Box>
		</VStack>
	);
}
