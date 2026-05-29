import {
	AlertDialog,
	AlertDialogBody,
	AlertDialogContent,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogOverlay,
	Box,
	Button,
	FormControl,
	FormLabel,
	HStack,
	IconButton,
	NumberDecrementStepper,
	NumberIncrementStepper,
	NumberInput,
	NumberInputField,
	NumberInputStepper,
	Select,
	Table,
	Tbody,
	Td,
	Text,
	Th,
	Thead,
	Tr,
	useDisclosure,
	useToast,
	VStack,
} from "@chakra-ui/react";
import {
	useRef,
	useState,
	type ChangeEvent,
	type ReactElement,
} from "react";
import { FiTrash2 } from "react-icons/fi";
import { useGuildOverview } from "@/modules/guilds/hooks/useGuildOverview";
import {
	useCreateReward,
	useDeleteReward,
	useRewards,
} from "@/modules/leveling/hooks/useRewards";

type Props = {
	guildId: string;
};

export function RewardsTab({ guildId }: Props): ReactElement {
	const rewards = useRewards(guildId);
	const overview = useGuildOverview(guildId);
	const createReward = useCreateReward(guildId);
	const deleteReward = useDeleteReward(guildId);
	const toast = useToast();

	const [newLevel, setNewLevel] = useState<number | "">("");
	const [newRoleId, setNewRoleId] = useState<string>("");

	// Confirmation state for delete; track the pending level so the dialog knows what to remove.
	const confirm = useDisclosure();
	const cancelRef = useRef<HTMLButtonElement>(null);
	const [pendingDelete, setPendingDelete] = useState<number | null>(null);

	const roles = overview.data?.roles ?? [];

	const roleNameById = (roleId: string): string =>
		roles.find((r) => r.id === roleId)?.name ?? roleId;

	const addDisabled =
		newLevel === "" || newRoleId === "" || createReward.isPending;

	const handleAdd = (): void => {
		if (newLevel === "" || newRoleId === "") return;
		createReward.mutate(
			{ level: newLevel, roleId: newRoleId },
			{
				onSuccess: () => {
					toast({ status: "success", title: "Reward added" });
					setNewLevel("");
					setNewRoleId("");
				},
			}
		);
	};

	const openConfirm = (level: number): void => {
		setPendingDelete(level);
		confirm.onOpen();
	};

	const handleConfirmDelete = (): void => {
		if (pendingDelete === null) return;
		const level = pendingDelete;
		deleteReward.mutate(level, {
			onSuccess: () => {
				toast({ status: "success", title: "Reward removed" });
			},
			onSettled: () => {
				setPendingDelete(null);
				confirm.onClose();
			},
		});
	};

	const handleCancelDelete = (): void => {
		setPendingDelete(null);
		confirm.onClose();
	};

	const list = rewards.data ?? [];

	return (
		<VStack align="stretch" spacing={6}>
			<Box bg="bg.surface" borderRadius="2xl" boxShadow="sm" p={6}>
				<HStack align="flex-end" spacing={4}>
					<FormControl maxW="160px">
						<FormLabel>Level</FormLabel>
						<NumberInput
							min={1}
							value={newLevel}
							onChange={(_, valueNumber: number) => {
								setNewLevel(Number.isNaN(valueNumber) ? "" : valueNumber);
							}}
						>
							<NumberInputField />
							<NumberInputStepper>
								<NumberIncrementStepper />
								<NumberDecrementStepper />
							</NumberInputStepper>
						</NumberInput>
					</FormControl>

					<FormControl>
						<FormLabel>Role</FormLabel>
						<Select
							placeholder="Select role"
							value={newRoleId}
							onChange={(event_: ChangeEvent<HTMLSelectElement>) => {
								setNewRoleId(event_.target.value);
							}}
						>
							{roles.map((r) => (
								<option key={r.id} value={r.id}>
									{r.name}
								</option>
							))}
						</Select>
					</FormControl>

					<Button
						colorScheme="purple"
						isDisabled={addDisabled}
						isLoading={createReward.isPending}
						onClick={handleAdd}
					>
						Add
					</Button>
				</HStack>
			</Box>

			<Box bg="bg.surface" borderRadius="2xl" boxShadow="sm" p={6}>
				{list.length === 0 ? (
					<Text color="text.subtle">No rewards configured yet.</Text>
				) : (
					<Table size="sm">
						<Thead>
							<Tr>
								<Th>Level</Th>
								<Th>Role</Th>
								<Th />
							</Tr>
						</Thead>
						<Tbody>
							{list.map((reward) => (
								<Tr key={reward.level}>
									<Td>{reward.level}</Td>
									<Td>@{roleNameById(reward.roleId)}</Td>
									<Td textAlign="right">
										<IconButton
											aria-label={`Delete reward for level ${String(reward.level)}`}
											icon={<FiTrash2 />}
											size="sm"
											variant="ghost"
											onClick={() => {
												openConfirm(reward.level);
											}}
										/>
									</Td>
								</Tr>
							))}
						</Tbody>
					</Table>
				)}
			</Box>

			<AlertDialog
				isOpen={confirm.isOpen}
				leastDestructiveRef={cancelRef}
				onClose={handleCancelDelete}
			>
				<AlertDialogOverlay>
					<AlertDialogContent>
						<AlertDialogHeader fontSize="lg" fontWeight="bold">
							Delete reward
						</AlertDialogHeader>
						<AlertDialogBody>
							{pendingDelete === null
								? null
								: `Remove the role reward at level ${String(pendingDelete)}?`}
						</AlertDialogBody>
						<AlertDialogFooter>
							<Button ref={cancelRef} onClick={handleCancelDelete}>
								Cancel
							</Button>
							<Button
								colorScheme="red"
								isLoading={deleteReward.isPending}
								ml={3}
								onClick={handleConfirmDelete}
							>
								Delete
							</Button>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialogOverlay>
			</AlertDialog>
		</VStack>
	);
}
