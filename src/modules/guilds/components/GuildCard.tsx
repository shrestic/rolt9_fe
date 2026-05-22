import { Box, Button, HStack, Image } from "@chakra-ui/react";
import { Link } from "@tanstack/react-router";
import type { ReactElement } from "react";
import type { GuildSummary } from "@/data/models/guild";
import { config } from "@/settings/config";

type Props = { guild: GuildSummary; onInviteStart: () => void };

const BOT_INVITE_BASE = config.botInviteUrl as string | undefined;

export const GuildCard = ({ guild, onInviteStart }: Props): ReactElement => {
	const openInvite = (): void => {
		onInviteStart();
		const base =
			BOT_INVITE_BASE ??
			"https://discord.com/api/oauth2/authorize?client_id=PLACEHOLDER&permissions=8&scope=bot+applications.commands";
		const url = `${base}&guild_id=${guild.discordId}&disable_guild_select=true`;
		window.open(url, "_blank", "width=600,height=800");
	};

	return (
		<Box
			bg="white"
			borderRadius="2xl"
			boxShadow="md"
			p={5}
			transition="all 0.2s"
			_hover={{
				transform: "translateY(-2px)",
				boxShadow: "lg",
			}}
		>
			<HStack mb={4} spacing={3}>
				{guild.iconUrl ? (
					<Box
						borderRadius="full"
						display="inline-flex"
						p="2px"
						style={{
							background: "linear-gradient(135deg, #f472b6, #a855f7)",
						}}
					>
						<Image
							alt=""
							borderRadius="full"
							boxSize="40px"
							src={guild.iconUrl}
						/>
					</Box>
				) : (
					<Box
						alignItems="center"
						borderRadius="full"
						boxSize="40px"
						display="flex"
						fontSize="lg"
						justifyContent="center"
						style={{
							background: "linear-gradient(135deg, #fce7f3, #f3e8ff)",
						}}
					>
						🤖
					</Box>
				)}
				<Box color="gray.800" fontSize="sm" fontWeight="semibold">
					{guild.name}
				</Box>
			</HStack>
			{guild.botPresent ? (
				<Link params={{ guildId: guild.discordId }} to="/dashboard/$guildId">
					<Button
						borderRadius="lg"
						color="white"
						fontWeight="semibold"
						size="sm"
						transition="all 0.2s"
						w="full"
						_hover={{
							opacity: 0.9,
							boxShadow: "md",
						}}
						style={{
							background: "linear-gradient(to right, #ec4899, #a855f7)",
						}}
					>
						Configure
					</Button>
				</Link>
			) : (
				<Button
					borderRadius="lg"
					colorScheme="purple"
					fontWeight="medium"
					size="sm"
					transition="all 0.2s"
					variant="outline"
					w="full"
					onClick={openInvite}
				>
					Add bot
				</Button>
			)}
		</Box>
	);
};
