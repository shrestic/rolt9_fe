import {
	Box,
	Heading,
	SimpleGrid,
	Skeleton,
	Text,
	VStack,
} from "@chakra-ui/react";
import type { ReactElement } from "react";
import { useMyGuilds } from "@/modules/guilds/hooks/useMyGuilds";
import { useGuildUiStore } from "@/modules/guilds/store/guild-ui.store";
import { GuildCard } from "@/modules/guilds/components/GuildCard";
import { gradients } from "@/theme/tokens";

export function ServerPickerView(): ReactElement {
	const invitePolling = useGuildUiStore((s) => s.invitePolling);
	const startInvitePolling = useGuildUiStore((s) => s.startInvitePolling);
	const stopInvitePolling = useGuildUiStore((s) => s.stopInvitePolling);
	const { data, isLoading } = useMyGuilds(invitePolling ? 5000 : undefined);

	return (
		<Box p={8}>
			<Heading
				bgClip="text"
				bgGradient={gradients.brand}
				fontWeight="extrabold"
				mb={8}
				size="lg"
			>
				Your servers ✨
			</Heading>

			{isLoading && (
				<SimpleGrid columns={[1, 2, 3]} spacing={6}>
					{Array.from({ length: 3 }).map((_, index) => (
						<Skeleton
							key={index}
							borderRadius="2xl"
							endColor="pink.50"
							h="120px"
							startColor="purple.50"
						/>
					))}
				</SimpleGrid>
			)}

			{!isLoading && data?.length === 0 && (
				<VStack color="text.subtle" py={16} spacing={4} textAlign="center">
					<Text fontSize="4xl">🌱</Text>
					<Text fontSize="md" lineHeight="tall" maxW="320px">
						No servers yet — go create one in Discord and come back!
					</Text>
				</VStack>
			)}

			{!isLoading && data && data.length > 0 && (
				<SimpleGrid columns={[1, 2, 3]} spacing={6}>
					{data.map((g) => (
						<GuildCard
							key={g.discordId}
							guild={g}
							onInviteStart={() => {
								startInvitePolling();
								setTimeout(() => {
									stopInvitePolling();
								}, 120_000);
							}}
						/>
					))}
				</SimpleGrid>
			)}
		</Box>
	);
}
