import { Badge, Button, Table, Tbody, Td, Text, Th, Thead, Tr } from "@chakra-ui/react";
import type { ReactElement } from "react";
import type { ModerationCase } from "@/data/models/moderation";

type Props = { cases: Array<ModerationCase>; onDeactivate: (caseNumber: number) => void };

export const CaseTable = ({ cases, onDeactivate }: Props): ReactElement => {
	if (cases.length === 0) {
		return <Text color="text.subtle">No cases yet.</Text>;
	}
	return (
		<Table size="sm">
			<Thead>
				<Tr>
					<Th>#</Th>
					<Th>Action</Th>
					<Th>User</Th>
					<Th>Moderator</Th>
					<Th>Reason</Th>
					<Th />
				</Tr>
			</Thead>
			<Tbody>
				{cases.map((c) => (
					<Tr key={c.caseNumber} opacity={c.active ? 1 : 0.5}>
						<Td>{c.caseNumber}</Td>
						<Td>
							<Badge>{c.action}</Badge>
							{c.source === "escalation" && (
								<Badge colorScheme="orange" ml={1}>
									auto
								</Badge>
							)}
						</Td>
						<Td>{c.targetUsername}</Td>
						<Td>{c.moderatorUsername}</Td>
						<Td>{c.reason ?? "—"}</Td>
						<Td>
							{c.active && (
								<Button
									size="xs"
									variant="ghost"
									onClick={() => {
										onDeactivate(c.caseNumber);
									}}
								>
									{c.action === "ban" ? "Unban" : "Remove"}
								</Button>
							)}
						</Td>
					</Tr>
				))}
			</Tbody>
		</Table>
	);
};
