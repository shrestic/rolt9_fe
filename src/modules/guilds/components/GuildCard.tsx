import { Box, Button, HStack, Image } from "@chakra-ui/react";
import { Link } from "@tanstack/react-router";
import type { ReactElement } from "react";
import type { GuildSummary } from "@/data/models/guild";
import { config } from "@/settings/config";
import { gradients } from "@/theme/tokens";

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
			bg="bg.surface"
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
						bgGradient="linear(135deg, pink.400, purple.500)"
						borderRadius="full"
						display="inline-flex"
						p="2px"
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
						bgGradient={gradients.brandSoft}
						borderRadius="full"
						boxSize="40px"
						display="flex"
						fontSize="lg"
						justifyContent="center"
					>
						🤖
					</Box>
				)}
				<Box color="text.default" fontSize="sm" fontWeight="semibold">
					{guild.name}
				</Box>
			</HStack>
			{guild.botPresent ? (
				<Link params={{ guildId: guild.discordId }} to="/dashboard/$guildId">
					<Button
						borderRadius="lg"
						fontWeight="semibold"
						size="sm"
						variant="gradient"
						w="full"
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
