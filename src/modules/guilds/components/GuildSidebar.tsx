import { VStack, Box, Badge, HStack } from "@chakra-ui/react";
import type { ReactElement } from "react";

const ITEMS = [
	{ label: "Overview", enabled: true },
	{ label: "Moderation", enabled: false },
	{ label: "Commands", enabled: false },
	{ label: "Welcome", enabled: false },
	{ label: "Auto-mod", enabled: false },
	{ label: "Reaction Roles", enabled: false },
	{ label: "Logging", enabled: false },
	{ label: "Leveling", enabled: false },
];

export const GuildSidebar = (): ReactElement => (
	<VStack
		align="stretch"
		bg="gray.50"
		borderColor="gray.100"
		borderRightWidth={1}
		minW="220px"
		p={4}
		spacing={1}
	>
		{ITEMS.map((it) => (
			<HStack
				key={it.label}
				bgGradient={it.enabled ? "linear(to-r, pink.50, purple.50)" : undefined}
				borderRadius="full"
				cursor={it.enabled ? "pointer" : "not-allowed"}
				opacity={it.enabled ? 1 : 0.5}
				px={4}
				py={2}
				transition="opacity 0.15s"
				_hover={
					it.enabled
						? { bgGradient: "linear(to-r, pink.100, purple.100)" }
						: { opacity: 0.35 }
				}
			>
				<Box
					color={it.enabled ? "purple.700" : "gray.600"}
					flex={1}
					fontSize="sm"
					fontWeight={it.enabled ? "semibold" : "normal"}
				>
					{it.label}
				</Box>
				{!it.enabled && (
					<Badge
						borderRadius="full"
						colorScheme="pink"
						fontSize="2xs"
						px={2}
						variant="subtle"
					>
						Soon
					</Badge>
				)}
			</HStack>
		))}
	</VStack>
);
