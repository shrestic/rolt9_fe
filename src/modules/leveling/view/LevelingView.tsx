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
import { LeaderboardTable } from "@/modules/leveling/components/LeaderboardTable";
import { LevelingSettingsForm } from "@/modules/leveling/components/LevelingSettingsForm";
import { RewardsTab } from "@/modules/leveling/components/RewardsTab";
import { ThemeEditor } from "@/modules/leveling/components/ThemeEditor";

export function LevelingView(): ReactElement {
	const { guildId } = useParams({ from: "/dashboard/$guildId/leveling" });

	return (
		<VStack align="stretch" spacing={8}>
			<Heading size="md">Leveling</Heading>

			<Box bg="bg.surface" borderRadius="2xl" boxShadow="sm" p={6}>
				<Tabs variant="enclosed">
					<TabList>
						<Tab>Settings</Tab>
						<Tab>Leaderboard</Tab>
						<Tab>Theme</Tab>
						<Tab>Rewards</Tab>
					</TabList>
					<TabPanels>
						<TabPanel px={0}>
							<LevelingSettingsForm guildId={guildId} />
						</TabPanel>
						<TabPanel px={0}>
							<LeaderboardTable guildId={guildId} />
						</TabPanel>
						<TabPanel px={0}>
							<ThemeEditor guildId={guildId} />
						</TabPanel>
						<TabPanel px={0}>
							<RewardsTab guildId={guildId} />
						</TabPanel>
					</TabPanels>
				</Tabs>
			</Box>
		</VStack>
	);
}
