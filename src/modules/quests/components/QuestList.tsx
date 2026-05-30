import {
	Badge,
	Box,
	Button,
	HStack,
	Spinner,
	Table,
	Tbody,
	Td,
	Text,
	Th,
	Thead,
	Tr,
} from "@chakra-ui/react";
import type { ReactElement } from "react";
import { useDeleteQuest, useQuests } from "@/modules/quests/hooks/useQuests";
import type { Quest } from "@/data/models/quests";

type Props = {
	guildId: string;
	// Called when the user clicks "Edit" on a row — parent manages form state.
	onEdit: (quest: Quest) => void;
};

// Human-readable labels for the objective_type wire values.
// Keys are snake_case wire identifiers; camelcase rule suppressed intentionally.
const OBJECTIVE_LABELS: Record<Quest["objectiveType"], string> = {
	// eslint-disable-next-line camelcase
	earn_coins: "Kiếm coin",
	// eslint-disable-next-line camelcase
	daily_claim: "Điểm danh",
};

// Renders one row in the quest table.
function QuestRow({
	quest,
	onEdit,
	onDelete,
	isDeleting,
}: {
	quest: Quest;
	onEdit: () => void;
	onDelete: () => void;
	isDeleting: boolean;
}): ReactElement {
	return (
		<Tr>
			<Td fontWeight="semibold">{quest.name}</Td>
			<Td textTransform="capitalize">{quest.period}</Td>
			<Td>{OBJECTIVE_LABELS[quest.objectiveType]}</Td>
			{/* Target — the numeric threshold for completion */}
			<Td isNumeric>{quest.target.toLocaleString()}</Td>
			{/* Reward — coins granted on completion */}
			<Td isNumeric>{quest.rewardCoins.toLocaleString()}</Td>
			<Td>
				{quest.enabled ? (
					<Badge borderRadius="full" colorScheme="green" px={2}>
						Active
					</Badge>
				) : (
					<Badge borderRadius="full" colorScheme="gray" px={2}>
						Inactive
					</Badge>
				)}
			</Td>
			<Td>
				<HStack spacing={2}>
					<Button size="sm" variant="outline" onClick={onEdit}>
						Edit
					</Button>
					<Button
						colorScheme="red"
						isLoading={isDeleting}
						size="sm"
						variant="ghost"
						onClick={onDelete}
					>
						Delete
					</Button>
				</HStack>
			</Td>
		</Tr>
	);
}

// Renders the full quest list for a guild. Shows a spinner while loading and
// an empty state if there are no quests yet. Each row has Edit + Delete actions.
export function QuestList({ guildId, onEdit }: Props): ReactElement {
	const { data: quests, isLoading } = useQuests(guildId);
	const deleteQuest = useDeleteQuest(guildId);

	if (isLoading) {
		return (
			<Box py={8} textAlign="center">
				<Spinner />
			</Box>
		);
	}

	if (!quests || quests.length === 0) {
		return (
			<Text color="text.muted" fontSize="sm" py={4}>
				No quests configured yet — create one above.
			</Text>
		);
	}

	return (
		<Box overflowX="auto">
			<Table size="sm" variant="simple">
				<Thead>
					<Tr>
						<Th>Name</Th>
						<Th>Period</Th>
						<Th>Objective</Th>
						<Th isNumeric>Target</Th>
						<Th isNumeric>Reward</Th>
						<Th>Status</Th>
						<Th />
					</Tr>
				</Thead>
				<Tbody>
					{quests.map((quest) => (
						<QuestRow
							key={quest.id}
							quest={quest}
							isDeleting={
								// Show spinner on the specific row being deleted.
								deleteQuest.isPending &&
								deleteQuest.variables === quest.id
							}
							onDelete={() => {
								deleteQuest.mutate(quest.id);
							}}
							onEdit={() => {
								onEdit(quest);
							}}
						/>
					))}
				</Tbody>
			</Table>
		</Box>
	);
}
