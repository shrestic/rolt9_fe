import {
	Avatar,
	Box,
	Flex,
	IconButton,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
	Text,
} from "@chakra-ui/react";
import type { ReactElement, ReactNode } from "react";
import { useCurrentUser } from "@/modules/authentication/hooks/useCurrentUser";
import { useLogout } from "@/modules/authentication/hooks/useLogout";
import { gradients } from "@/theme/tokens";

export const RootView = ({
	children,
}: {
	children: ReactNode;
}): ReactElement => {
	const { data: user } = useCurrentUser();
	const logout = useLogout();

	return (
		<Flex direction="column" minH="100vh">
			<Flex
				align="center"
				as="header"
				bgGradient={gradients.brandHero}
				boxShadow="sm"
				px={6}
				py={3}
			>
				<Flex align="center" gap={2}>
					<Text fontSize="xl">🤖</Text>
					<Box
						color="text.inverted"
						fontSize="lg"
						fontWeight="bold"
						letterSpacing="tight"
					>
						rolt9
					</Box>
				</Flex>
				<Box flex={1} />
				{user && (
					<Menu>
						<MenuButton
							_hover={{ bg: "whiteAlpha.200" }}
							aria-label="user menu"
							as={IconButton}
							colorScheme="whiteAlpha"
							variant="ghost"
							icon={
								<Avatar
									name={user.username}
									ring={2}
									ringColor="whiteAlpha.600"
									size="sm"
									src={user.avatarUrl ?? undefined}
								/>
							}
						/>
						<MenuList>
							<MenuItem
								onClick={() => {
									logout.mutate();
								}}
							>
								Logout
							</MenuItem>
						</MenuList>
					</Menu>
				)}
			</Flex>
			<Box as="main" flex={1}>
				{children}
			</Box>
		</Flex>
	);
};
