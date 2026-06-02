import { Badge, Box, HStack, Image, Text, VStack } from "@chakra-ui/react";
import { Link } from "@tanstack/react-router";
import type { ReactElement } from "react";
import { useGuildOverview } from "@/modules/guilds/hooks/useGuildOverview";

type Item = { label: string; to?: string; enabled: boolean };

const ITEMS: Array<Item> = [
	{ label: "Overview", to: "/dashboard/$guildId", enabled: true },
	{ label: "Moderation", to: "/dashboard/$guildId/moderation", enabled: true },
	{ label: "Commands", to: "/dashboard/$guildId/commands", enabled: true },
	{ label: "Welcome", to: "/dashboard/$guildId/welcome", enabled: true },
	{ label: "Auto-mod", enabled: false },
	{ label: "Reaction Roles", enabled: false },
	{ label: "Logging", enabled: false },
	{ label: "Leveling", to: "/dashboard/$guildId/leveling", enabled: true },
	{ label: "Currency", to: "/dashboard/$guildId/currency", enabled: true },
	{ label: "Karma", to: "/dashboard/$guildId/karma", enabled: true },
	{ label: "Pet", to: "/dashboard/$guildId/pet", enabled: true },
	{ label: "Quests", to: "/dashboard/$guildId/quests", enabled: true },
	{ label: "Badges", to: "/dashboard/$guildId/badges", enabled: true },
	{ label: "Mini-games", to: "/dashboard/$guildId/minigames", enabled: true },
	{ label: "AI", to: "/dashboard/$guildId/ai", enabled: true },
];

/** Header sidebar: nút về danh sách TẤT CẢ server + tên/icon server ĐANG xem (để biết
 * mình đang ở server nào mà KHÔNG phải bấm Overview, và quay lại danh sách không phải sửa URL). */
const SidebarHeader = ({ guildId }: { guildId: string }): ReactElement => {
	const { data } = useGuildOverview(guildId);
	return (
		<VStack align="stretch" mb={2} spacing={2}>
			<Link to="/dashboard">
				<HStack
					_hover={{ color: "accent.primaryActive" }}
					color="text.muted"
					fontSize="sm"
					fontWeight="semibold"
					spacing={1}
				>
					<Box as="span">←</Box>
					<Box as="span">All servers</Box>
				</HStack>
			</Link>
			<HStack
				bg="bg.subtle"
				borderRadius="lg"
				px={3}
				py={2}
				spacing={2}
				title={data?.name ?? guildId}
			>
				{data?.iconUrl ? (
					<Image
						alt={data.name}
						borderRadius="full"
						boxSize="28px"
						src={data.iconUrl}
					/>
				) : (
					<Box
						bg="accent.primary"
						borderRadius="full"
						boxSize="28px"
						color="white"
						fontSize="sm"
						fontWeight="bold"
						lineHeight="28px"
						textAlign="center"
					>
						{(data?.name ?? "?").charAt(0).toUpperCase()}
					</Box>
				)}
				<Text fontWeight="bold" noOfLines={1}>
					{data?.name ?? "Đang tải…"}
				</Text>
			</HStack>
		</VStack>
	);
};

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
		<SidebarHeader guildId={guildId} />
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
