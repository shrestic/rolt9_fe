import {
	Box,
	Heading,
	Tab,
	TabList,
	TabPanel,
	TabPanels,
	Tabs,
	VStack,
} from "@chakra-ui/react";
import { useParams } from "@tanstack/react-router";
import type { ReactElement } from "react";
import { KarmaLeaderboardTable } from "@/modules/karma/components/KarmaLeaderboardTable";
import { KarmaSettingsToggle } from "@/modules/karma/components/KarmaSettingsToggle";

// Top-level view for the karma dashboard tab. Composed of a settings toggle
// (enable/disable the system) and a paginated leaderboard of top members.
export function KarmaView(): ReactElement {
	const { guildId } = useParams({ from: "/dashboard/$guildId/karma" });

	return (
		<VStack align="stretch" spacing={8}>
			<Heading size="md">Karma</Heading>

			<Box bg="bg.surface" borderRadius="2xl" boxShadow="sm" p={6}>
				<Tabs variant="enclosed">
					<TabList>
						<Tab>Settings</Tab>
						<Tab>Leaderboard</Tab>
					</TabList>
					<TabPanels>
						<TabPanel px={0}>
							<KarmaSettingsToggle guildId={guildId} />
						</TabPanel>
						<TabPanel px={0}>
							<KarmaLeaderboardTable guildId={guildId} />
						</TabPanel>
					</TabPanels>
				</Tabs>
			</Box>
		</VStack>
	);
}
