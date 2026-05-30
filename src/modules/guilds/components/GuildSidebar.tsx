import { Badge, Box, HStack, VStack } from "@chakra-ui/react";
import { Link } from "@tanstack/react-router";
import type { ReactElement } from "react";

type Item = { label: string; to?: string; enabled: boolean };

const ITEMS: Array<Item> = [
	{ label: "Overview", to: "/dashboard/$guildId", enabled: true },
	{ label: "Moderation", to: "/dashboard/$guildId/moderation", enabled: true },
	{ label: "Commands", to: "/dashboard/$guildId/commands", enabled: true },
	{ label: "Welcome", enabled: false },
	{ label: "Auto-mod", enabled: false },
	{ label: "Reaction Roles", enabled: false },
	{ label: "Logging", enabled: false },
	{ label: "Leveling", to: "/dashboard/$guildId/leveling", enabled: true },
	{ label: "Currency", to: "/dashboard/$guildId/currency", enabled: true },
	{ label: "Karma", to: "/dashboard/$guildId/karma", enabled: true },
	{ label: "Pet", to: "/dashboard/$guildId/pet", enabled: true },
	{ label: "Quests", to: "/dashboard/$guildId/quests", enabled: true },
	{ label: "Badges", to: "/dashboard/$guildId/badges", enabled: true },
];

export const GuildSidebar = ({
	guildId,
}: {
	guildId: string;
}): ReactElement => (
	<VStack
		align="stretch"
		bg="bg.muted"
		borderColor="border.subtle"
		borderRightWidth={1}
		minW="220px"
		p={4}
		spacing={1}
	>
		{ITEMS.map((it) =>
			it.enabled && it.to ? (
				<Link
					key={it.label}
					activeOptions={{ exact: it.to === "/dashboard/$guildId" }}
					params={{ guildId }}
					to={it.to}
				>
					{({ isActive }) => (
						<Box
							borderRadius="full"
							color="accent.primaryActive"
							fontSize="sm"
							fontWeight="semibold"
							px={4}
							py={2}
							bgGradient={
								isActive
									? "linear(to-r, pink.100, purple.100)"
									: "linear(to-r, pink.50, purple.50)"
							}
						>
							{it.label}
						</Box>
					)}
				</Link>
			) : (
				<HStack
					key={it.label}
					borderRadius="full"
					cursor="not-allowed"
					opacity={0.5}
					px={4}
					py={2}
				>
					<Box color="text.muted" flex={1} fontSize="sm">
						{it.label}
					</Box>
					<Badge
						borderRadius="full"
						colorScheme="pink"
						fontSize="2xs"
						px={2}
						variant="subtle"
					>
						Soon
					</Badge>
				</HStack>
			)
		)}
	</VStack>
);
