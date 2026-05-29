import {
	Box,
	Heading,
	HStack,
	Image,
	SimpleGrid,
	Skeleton,
	Text,
	VStack,
} from "@chakra-ui/react";
import { useParams } from "@tanstack/react-router";
import type { ReactElement } from "react";
import { StatTile } from "@/modules/guilds/components/StatTile";
import { useGuildOverview } from "@/modules/guilds/hooks/useGuildOverview";
import { gradients } from "@/theme/tokens";

export function GuildOverviewView(): ReactElement {
	const { guildId } = useParams({ from: "/dashboard/$guildId/" });
	const { data, isLoading, error } = useGuildOverview(guildId);

	return (
		<>
			{isLoading && <Skeleton borderRadius="2xl" h="80px" />}
			{error && (
				<Text color="text.danger">
					You don&apos;t have permission to configure this server.
				</Text>
			)}
			{data && (
				<VStack align="stretch" spacing={8}>
					<Box bg="bg.surface" borderRadius="2xl" boxShadow="sm" p={6}>
						<HStack spacing={5}>
							{data.iconUrl ? (
								<Image alt="" borderRadius="full" boxSize="64px" src={data.iconUrl} />
							) : (
								<Box
									alignItems="center"
									bgGradient={gradients.brandSoft}
									borderRadius="full"
									boxSize="64px"
									display="flex"
									fontSize="2xl"
									justifyContent="center"
								>
									🤖
								</Box>
							)}
							<Heading color="text.default" size="md">
								{data.name}
							</Heading>
						</HStack>
					</Box>
					<SimpleGrid columns={[1, 3]} spacing={4}>
						<StatTile emoji="👥" label="Members" value={data.memberCount} />
						<StatTile emoji="💬" label="Channels" value={data.channels.length} />
						<StatTile emoji="🎭" label="Roles" value={data.roles.length} />
					</SimpleGrid>
				</VStack>
			)}
		</>
	);
}
