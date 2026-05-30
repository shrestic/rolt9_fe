import { Box, Heading, VStack } from "@chakra-ui/react";
import { useParams } from "@tanstack/react-router";
import type { ReactElement } from "react";
import { WelcomeSettingsForm } from "@/modules/welcome/components/WelcomeSettingsForm";

export function WelcomeView(): ReactElement {
	const { guildId } = useParams({ from: "/dashboard/$guildId/welcome" });

	return (
		<VStack align="stretch" spacing={8}>
			<Heading size="md">Welcome</Heading>

			<Box bg="bg.surface" borderRadius="2xl" boxShadow="sm" p={6}>
				<WelcomeSettingsForm guildId={guildId} />
			</Box>
		</VStack>
	);
}
