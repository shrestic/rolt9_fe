import {
	Box,
	Flex,
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
import { useGuildOverview } from "@/modules/guilds/hooks/useGuildOverview";
import { GuildSidebar } from "@/modules/guilds/components/GuildSidebar";
import { StatTile } from "@/modules/guilds/components/StatTile";

export function GuildDetailView(): ReactElement {
	const { guildId } = useParams({ from: "/dashboard/$guildId" });
	const { data, isLoading, error } = useGuildOverview(guildId);

	return (
		<Flex>
			<GuildSidebar />
			<Box flex={1} p={8}>
				{isLoading && <Skeleton borderRadius="2xl" h="80px" />}
				{error && (
					<Text color="red.500">
						You don&apos;t have permission to configure this server.
					</Text>
				)}
				{data && (
					<VStack align="stretch" spacing={8}>
						{/* Server identity */}
						<Box bg="white" borderRadius="2xl" boxShadow="sm" p={6}>
							<HStack spacing={5}>
								{data.iconUrl ? (
									<Box
										bgGradient="linear(to-br, pink.400, purple.500, blurple.500)"
										borderRadius="full"
										display="inline-flex"
										flexShrink={0}
										p="3px"
									>
										<Image
											alt=""
											borderRadius="full"
											boxSize="64px"
											src={data.iconUrl}
										/>
									</Box>
								) : (
									<Box
										alignItems="center"
										bgGradient="linear(to-br, pink.100, purple.100)"
										borderRadius="full"
										boxSize="64px"
										display="flex"
										flexShrink={0}
										fontSize="2xl"
										justifyContent="center"
									>
										🤖
									</Box>
								)}
								<Heading color="gray.800" size="md">
									{data.name}
								</Heading>
							</HStack>
						</Box>

						{/* Stat tiles */}
						<SimpleGrid columns={[1, 3]} spacing={4}>
							<StatTile emoji="👥" label="Members" value={data.memberCount} />
							<StatTile
								emoji="💬"
								label="Channels"
								value={data.channels.length}
							/>
							<StatTile emoji="🎭" label="Roles" value={data.roles.length} />
						</SimpleGrid>
					</VStack>
				)}
			</Box>
		</Flex>
	);
}
