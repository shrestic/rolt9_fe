import {
	AlertDialog,
	AlertDialogBody,
	AlertDialogContent,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogOverlay,
	Box,
	Button,
	HStack,
	IconButton,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	NumberDecrementStepper,
	NumberIncrementStepper,
	NumberInput,
	NumberInputField,
	NumberInputStepper,
	Spinner,
	Table,
	Tbody,
	Td,
	Text,
	Th,
	Thead,
	Tr,
	useDisclosure,
	useToast,
} from "@chakra-ui/react";
import { useRef, useState, type ReactElement } from "react";
import { FiEdit2, FiRotateCcw } from "react-icons/fi";
import { useCurrencyLeaderboard } from "@/modules/currency/hooks/useCurrencyLeaderboard";
import {
	useResetMember,
	useUpdateMember,
} from "@/modules/currency/hooks/useCurrencyMemberAdmin";

type Props = {
	guildId: string;
};

type EditingMember = {
	userId: string;
	currentBalance: number;
};

const PAGE_SIZE = 20;

export function CurrencyLeaderboardTable({ guildId }: Props): ReactElement {
	const [page, setPage] = useState<number>(1);
	const query = useCurrencyLeaderboard(guildId, { page, pageSize: PAGE_SIZE });
	const updateMember = useUpdateMember(guildId);
	const resetMember = useResetMember(guildId);
	const toast = useToast();

	const editDisclosure = useDisclosure();
	const resetDisclosure = useDisclosure();
	const cancelRef = useRef<HTMLButtonElement>(null);

	const [editingMember, setEditingMember] = useState<EditingMember | null>(
		null
	);
	const [editBalanceValue, setEditBalanceValue] = useState<number | "">("");
	const [resettingUserId, setResettingUserId] = useState<string | null>(null);

	const openEdit = (userId: string, currentBalance: number): void => {
		setEditingMember({ userId, currentBalance });
		setEditBalanceValue(currentBalance);
		editDisclosure.onOpen();
	};

	const closeEdit = (): void => {
		setEditingMember(null);
		setEditBalanceValue("");
		editDisclosure.onClose();
	};

	const handleSaveBalance = (): void => {
		if (editingMember === null || editBalanceValue === "") return;
		const balance = editBalanceValue;
		updateMember.mutate(
			{ userId: editingMember.userId, balance },
			{
				onSuccess: () => {
					toast({ status: "success", title: "Balance updated" });
					closeEdit();
				},
			}
		);
	};

	const openReset = (userId: string): void => {
		setResettingUserId(userId);
		resetDisclosure.onOpen();
	};

	const closeReset = (): void => {
		setResettingUserId(null);
		resetDisclosure.onClose();
	};

	const handleConfirmReset = (): void => {
		if (resettingUserId === null) return;
		const userId = resettingUserId;
		resetMember.mutate(userId, {
			onSuccess: () => {
				toast({ status: "success", title: "Balance reset" });
			},
			onSettled: () => {
				closeReset();
			},
		});
	};

	if (query.isLoading) {
		return (
			<HStack justify="center" py={12}>
				<Spinner color="purple.400" />
			</HStack>
		);
	}

	const data = query.data;
	const total = data?.total ?? 0;

	if (total === 0) {
		return (
			<Text color="text.subtle">
				No balances yet — enable currency and start chatting.
			</Text>
		);
	}

	const items = data?.items ?? [];
	const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
	const previousDisabled = page <= 1;
	const nextDisabled = page >= totalPages;

	return (
		<Box>
			<Table size="sm">
				<Thead>
					<Tr>
						<Th>Rank</Th>
						<Th>User ID</Th>
						<Th isNumeric>Balance</Th>
						<Th textAlign="right">Actions</Th>
					</Tr>
				</Thead>
				<Tbody>
					{items.map((entry) => (
						<Tr key={entry.userId}>
							<Td>{entry.rank}</Td>
							<Td fontFamily="mono">{entry.userId}</Td>
							<Td isNumeric>{entry.balance.toLocaleString()}</Td>
							<Td textAlign="right">
								<HStack justify="flex-end" spacing={1}>
									<IconButton
										aria-label={`Edit balance for ${entry.userId}`}
										icon={<FiEdit2 />}
										size="sm"
										variant="ghost"
										onClick={() => {
											openEdit(entry.userId, entry.balance);
										}}
									/>
									<IconButton
										aria-label={`Reset balance for ${entry.userId}`}
										icon={<FiRotateCcw />}
										size="sm"
										variant="ghost"
										onClick={() => {
											openReset(entry.userId);
										}}
									/>
								</HStack>
							</Td>
						</Tr>
					))}
				</Tbody>
			</Table>

			<HStack justify="flex-end" mt={4} spacing={3}>
				<Button
					isDisabled={previousDisabled}
					size="sm"
					variant="ghost"
					onClick={() => {
						setPage((current) => Math.max(1, current - 1));
					}}
				>
					Prev
				</Button>
				<Text color="text.subtle" fontSize="sm">
					Page {page} of {totalPages}
				</Text>
				<Button
					isDisabled={nextDisabled}
					size="sm"
					variant="ghost"
					onClick={() => {
						setPage((current) => Math.min(totalPages, current + 1));
					}}
				>
					Next
				</Button>
			</HStack>

			<Modal isOpen={editDisclosure.isOpen} onClose={closeEdit}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Edit balance</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						{editingMember === null ? null : (
							<>
								<Text color="text.subtle" fontSize="sm" mb={3}>
									User ID:{" "}
									<Text as="span" fontFamily="mono">
										{editingMember.userId}
									</Text>
								</Text>
								<NumberInput
									min={0}
									value={editBalanceValue}
									onChange={(_, valueNumber: number) => {
										setEditBalanceValue(
											Number.isNaN(valueNumber) ? "" : valueNumber
										);
									}}
								>
									<NumberInputField />
									<NumberInputStepper>
										<NumberIncrementStepper />
										<NumberDecrementStepper />
									</NumberInputStepper>
								</NumberInput>
							</>
						)}
					</ModalBody>
					<ModalFooter>
						<Button mr={3} variant="ghost" onClick={closeEdit}>
							Cancel
						</Button>
						<Button
							colorScheme="purple"
							isDisabled={editBalanceValue === ""}
							isLoading={updateMember.isPending}
							onClick={handleSaveBalance}
						>
							Save
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>

			<AlertDialog
				isOpen={resetDisclosure.isOpen}
				leastDestructiveRef={cancelRef}
				onClose={closeReset}
			>
				<AlertDialogOverlay>
					<AlertDialogContent>
						<AlertDialogHeader fontSize="lg" fontWeight="bold">
							Reset balance
						</AlertDialogHeader>
						<AlertDialogBody>
							{resettingUserId === null
								? null
								: `Reset balance for user ${resettingUserId}?`}
						</AlertDialogBody>
						<AlertDialogFooter>
							<Button ref={cancelRef} onClick={closeReset}>
								Cancel
							</Button>
							<Button
								colorScheme="red"
								isLoading={resetMember.isPending}
								ml={3}
								onClick={handleConfirmReset}
							>
								Reset
							</Button>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialogOverlay>
			</AlertDialog>
		</Box>
	);
}
