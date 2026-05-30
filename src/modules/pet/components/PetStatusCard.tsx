import {
	Box,
	Progress,
	Text,
	VStack,
} from "@chakra-ui/react";
import type { ReactElement } from "react";
import { usePetStatus } from "@/modules/pet/hooks/usePet";

type Props = {
	guildId: string;
};

export function PetStatusCard({ guildId }: Props): ReactElement {
	const { data: status } = usePetStatus(guildId);

	// While loading or when the pet system is disabled, show a minimal fallback.
	if (!status || !status.enabled) {
		return (
			<Box
				bg="bg.surface"
				borderRadius="2xl"
				boxShadow="sm"
				color="text.muted"
				fontSize="sm"
				p={6}
				textAlign="center"
			>
				Pet chưa bật
			</Box>
		);
	}

	return (
		<Box bg="bg.surface" borderRadius="2xl" boxShadow="sm" p={6}>
			<VStack align="stretch" spacing={4}>
				{/* Large emoji header: stage emoji + mood emoji side by side. */}
				<Text fontSize="5xl" textAlign="center">
					{status.stageEmoji}
					{status.moodEmoji}
				</Text>

				{/* Pet name + level + stage label. */}
				<Text fontWeight="bold" textAlign="center">
					{status.name} — Lv {status.level} ({status.stageName})
				</Text>

				{/* XP counter. */}
				<Text color="text.muted" fontSize="sm" textAlign="center">
					XP: {status.xp}
				</Text>

				{/* Hunger bar: 0 = starving, 100 = full. */}
				<Box>
					<Text fontSize="sm" fontWeight="semibold" mb={1}>
						Hunger
					</Text>
					<Progress
						borderRadius="full"
						colorScheme="orange"
						max={100}
						size="sm"
						value={status.hunger}
					/>
					<Text color="text.muted" fontSize="xs" mt={1} textAlign="right">
						{status.hunger} / 100
					</Text>
				</Box>

				{/* Happiness bar: 0 = miserable, 100 = ecstatic. */}
				<Box>
					<Text fontSize="sm" fontWeight="semibold" mb={1}>
						Happiness
					</Text>
					<Progress
						borderRadius="full"
						colorScheme="pink"
						max={100}
						size="sm"
						value={status.happiness}
					/>
					<Text color="text.muted" fontSize="xs" mt={1} textAlign="right">
						{status.happiness} / 100
					</Text>
				</Box>
			</VStack>
		</Box>
	);
}
