import { Button } from "@chakra-ui/react";
import type { ReactElement } from "react";
import { config } from "@/settings/config";
import { endpoints } from "@/settings/endpoints";

export const LoginButton = (): ReactElement => {
	const onClick = (): void => {
		window.location.assign(`${config.apiBaseUrl}${endpoints.discordLogin()}`);
	};
	return (
		<Button
			borderRadius="full"
			boxShadow="md"
			fontSize="md"
			fontWeight="semibold"
			px={10}
			py={6}
			size="lg"
			variant="gradient"
			onClick={onClick}
		>
			Login with Discord
		</Button>
	);
};
