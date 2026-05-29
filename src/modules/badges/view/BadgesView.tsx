import { Box, Heading, VStack } from "@chakra-ui/react";
import { useParams } from "@tanstack/react-router";
import type { ReactElement } from "react";
import { BadgeCatalogGrid } from "@/modules/badges/components/BadgeCatalogGrid";
import { BadgeSettingsToggle } from "@/modules/badges/components/BadgeSettingsToggle";

// Top-level Badges dashboard page. Mirrors CurrencyView — a page heading,
// the enable toggle, then the read-only catalog grid below.
export function BadgesView(): ReactElement {
	const { guildId } = useParams({ from: "/dashboard/$guildId/badges" });

	return (
		<VStack align="stretch" spacing={8}>
			<Heading size="md">Badges</Heading>

			{/* Master enable/disable toggle — same card style as currency. */}
			<BadgeSettingsToggle guildId={guildId} />

			{/* Read-only catalog grouped by stat type. */}
			<Box bg="bg.surface" borderRadius="2xl" boxShadow="sm" p={6}>
				<VStack align="stretch" spacing={4}>
					<Heading size="sm">Badge Catalog</Heading>
					<BadgeCatalogGrid guildId={guildId} />
				</VStack>
			</Box>
		</VStack>
	);
}
