import {
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
import { useState, type ReactElement } from "react";
import { useKarmaLeaderboard } from "@/modules/karma/hooks/useKarma";

type Props = {
	guildId: string;
};

const PAGE_SIZE = 20;

// Renders a paginated table of the top karma members for a guild.
// Each row shows rank, Discord user ID, and accumulated karma points.
export function KarmaLeaderboardTable({ guildId }: Props): ReactElement {
	const [page, setPage] = useState<number>(1);
	const query = useKarmaLeaderboard(guildId, { page, pageSize: PAGE_SIZE });

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
				No karma yet — enable karma and let members start reacting.
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
						<Th isNumeric>Points</Th>
					</Tr>
				</Thead>
				<Tbody>
					{items.map((entry) => (
						<Tr key={entry.userId}>
							<Td>{entry.rank}</Td>
							<Td fontFamily="mono">{entry.userId}</Td>
							<Td isNumeric>{entry.points.toLocaleString()}</Td>
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
		</Box>
	);
}
