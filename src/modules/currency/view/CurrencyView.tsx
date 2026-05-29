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
import { CurrencyLeaderboardTable } from "@/modules/currency/components/CurrencyLeaderboardTable";
import { CurrencySettingsForm } from "@/modules/currency/components/CurrencySettingsForm";

export function CurrencyView(): ReactElement {
	const { guildId } = useParams({ from: "/dashboard/$guildId/currency" });

	return (
		<VStack align="stretch" spacing={8}>
			<Heading size="md">Currency</Heading>

			<Box bg="bg.surface" borderRadius="2xl" boxShadow="sm" p={6}>
				<Tabs variant="enclosed">
					<TabList>
						<Tab>Settings</Tab>
						<Tab>Leaderboard</Tab>
					</TabList>
					<TabPanels>
						<TabPanel px={0}>
							<CurrencySettingsForm guildId={guildId} />
						</TabPanel>
						<TabPanel px={0}>
							<CurrencyLeaderboardTable guildId={guildId} />
						</TabPanel>
					</TabPanels>
				</Tabs>
			</Box>
		</VStack>
	);
}
