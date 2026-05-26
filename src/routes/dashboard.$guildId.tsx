import { Box, Flex } from "@chakra-ui/react";
import { createFileRoute, Outlet, useParams } from "@tanstack/react-router";
import type { ReactElement } from "react";
import { GuildSidebar } from "@/modules/guilds/components/GuildSidebar";

function GuildLayout(): ReactElement {
	const { guildId } = useParams({ from: "/dashboard/$guildId" });
	return (
		<Flex>
			<GuildSidebar guildId={guildId} />
			<Box flex={1} p={8}>
				<Outlet />
			</Box>
		</Flex>
	);
}

export const Route = createFileRoute("/dashboard/$guildId")({
	component: GuildLayout,
});
