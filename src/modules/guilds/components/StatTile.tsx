import { Box, Text } from "@chakra-ui/react";
import type { ReactElement } from "react";

export function StatTile({
	emoji,
	label,
	value,
}: {
	emoji: string;
	label: string;
	value: number;
}): ReactElement {
	return (
		<Box
			_hover={{ boxShadow: "md", transform: "translateY(-1px)" }}
			bg="white"
			borderRadius="2xl"
			boxShadow="sm"
			p={5}
			textAlign="center"
			transition="all 0.2s"
		>
			<Text fontSize="2xl" mb={1}>
				{emoji}
			</Text>
			<Text
				bgClip="text"
				bgGradient="linear(to-r, pink.500, purple.500)"
				fontSize="2xl"
				fontWeight="extrabold"
			>
				{value.toLocaleString()}
			</Text>
			<Text color="gray.500" fontSize="xs" fontWeight="medium" mt={1}>
				{label}
			</Text>
		</Box>
	);
}
