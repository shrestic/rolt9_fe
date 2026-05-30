import {
	Box,
	Button,
	Heading,
	VStack,
} from "@chakra-ui/react";
import { useParams } from "@tanstack/react-router";
import { useState, type ReactElement } from "react";
import { QuestForm } from "@/modules/quests/components/QuestForm";
import { QuestList } from "@/modules/quests/components/QuestList";
import {
	useCreateQuest,
	useUpdateQuest,
} from "@/modules/quests/hooks/useQuests";
import type { Quest, QuestInput } from "@/data/models/quests";

// Form visibility state:
//   - "hidden" → list only, "New quest" button visible
//   - "create" → blank create form open
//   - { quest } → edit form pre-filled with that quest's data
type FormState = "hidden" | "create" | { quest: Quest };

export function QuestsView(): ReactElement {
	const { guildId } = useParams({ from: "/dashboard/$guildId/quests" });

	const [formState, setFormState] = useState<FormState>("hidden");

	const create = useCreateQuest(guildId);
	const update = useUpdateQuest(guildId);

	// The mutation currently in flight, so the form can show its loading state.
	const isMutating = create.isPending || update.isPending;

	const handleSubmit = (input: QuestInput): void => {
		if (formState === "create") {
			create.mutate(input, {
				onSuccess: () => {
					setFormState("hidden");
				},
			});
		} else if (formState !== "hidden") {
			// formState is { quest } — we're editing an existing quest.
			update.mutate(
				{ questId: formState.quest.id, input },
				{
					onSuccess: () => {
						setFormState("hidden");
					},
				}
			);
		}
	};

	return (
		<VStack align="stretch" spacing={8}>
			<Heading size="md">Quests</Heading>

			<Box bg="bg.surface" borderRadius="2xl" boxShadow="sm" p={6}>
				<VStack align="stretch" spacing={6}>
					{/* "New quest" button — only shown when no form is open */}
					{formState === "hidden" && (
						<Box>
							<Button
								colorScheme="purple"
								onClick={() => {
									setFormState("create");
								}}
							>
								New quest
							</Button>
						</Box>
					)}

					{/* Create form */}
					{formState === "create" && (
						<Box
							bg="bg.subtle"
							borderColor="border.subtle"
							borderRadius="xl"
							borderWidth={1}
							p={4}
						>
							<Heading mb={4} size="sm">
								New quest
							</Heading>
							<QuestForm
								isLoading={isMutating}
								onSubmit={handleSubmit}
								onCancel={() => {
									setFormState("hidden");
								}}
							/>
						</Box>
					)}

					{/* Edit form — shown in-place above the list */}
					{formState !== "hidden" && formState !== "create" && (
						<Box
							bg="bg.subtle"
							borderColor="border.subtle"
							borderRadius="xl"
							borderWidth={1}
							p={4}
						>
							<Heading mb={4} size="sm">
								Edit quest
							</Heading>
							<QuestForm
								initial={formState.quest}
								isLoading={isMutating}
								onSubmit={handleSubmit}
								onCancel={() => {
									setFormState("hidden");
								}}
							/>
						</Box>
					)}

					{/* Quest list — always rendered so it re-fetches after mutations */}
					<QuestList
						guildId={guildId}
						onEdit={(quest) => {
							setFormState({ quest });
						}}
					/>
				</VStack>
			</Box>
		</VStack>
	);
}
