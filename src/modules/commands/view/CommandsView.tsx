import {
	Badge,
	Box,
	Button,
	Heading,
	HStack,
	Input,
	Table,
	Tbody,
	Td,
	Text,
	Th,
	Thead,
	Tr,
	useToast,
	VStack,
} from "@chakra-ui/react";
import { useParams } from "@tanstack/react-router";
import { useEffect, useState, type ChangeEvent, type ReactElement } from "react";
import { CommandForm } from "@/modules/commands/components/CommandForm";
import {
	useCommandSettings,
	useCommands,
	useCreateCommand,
	useDeleteCommand,
	useUpdateCommand,
	useUpdateCommandSettings,
} from "@/modules/commands/hooks/useCommands";
import { useGuildOverview } from "@/modules/guilds/hooks/useGuildOverview";
import type { CustomCommand, CustomCommandInput } from "@/data/models/command";

export function CommandsView(): ReactElement {
	const { guildId } = useParams({ from: "/dashboard/$guildId/commands" });
	const commands = useCommands(guildId);
	const overview = useGuildOverview(guildId);
	const settings = useCommandSettings(guildId);
	const create = useCreateCommand(guildId);
	const update = useUpdateCommand(guildId);
	const remove = useDeleteCommand(guildId);
	const updateSettings = useUpdateCommandSettings(guildId);
	const toast = useToast();

	const [editing, setEditing] = useState<CustomCommand | null>(null);
	const [showForm, setShowForm] = useState(false);
	const [prefix, setPrefix] = useState("!");

	useEffect(() => {
		if (settings.data) setPrefix(settings.data.prefix);
	}, [settings.data]);

	const handleSubmit = (input: CustomCommandInput): void => {
		const cbs = {
			onSuccess: (): void => {
				setShowForm(false);
				setEditing(null);
				toast({ status: "success", title: "Saved" });
			},
			onError: (): void => {
				toast({ status: "error", title: "Could not save (duplicate trigger?)" });
			},
		};
		if (editing) update.mutate({ commandId: editing.id, input }, cbs);
		else create.mutate(input, cbs);
	};

	return (
		<VStack align="stretch" spacing={8}>
			<Heading size="md">Custom commands</Heading>

			<Box bg="bg.surface" borderRadius="2xl" boxShadow="sm" p={6}>
				<HStack>
					<Text fontWeight="semibold">Prefix</Text>
					<Input
						maxW="80px"
						value={prefix}
						onChange={(event_: ChangeEvent<HTMLInputElement>) => {
							setPrefix(event_.target.value);
						}}
					/>
					<Button
						isLoading={updateSettings.isPending}
						size="sm"
						onClick={() => {
							updateSettings.mutate(
								{ prefix, enabled: true },
								{
									onSuccess: () => {
										toast({ status: "success", title: "Prefix saved" });
									},
								}
							);
						}}
					>
						Save
					</Button>
				</HStack>
			</Box>

			<Box bg="bg.surface" borderRadius="2xl" boxShadow="sm" p={6}>
				<HStack justify="space-between" mb={4}>
					<Heading size="sm">Commands</Heading>
					<Button
						colorScheme="purple"
						size="sm"
						onClick={() => {
							setEditing(null);
							setShowForm(true);
						}}
					>
						New command
					</Button>
				</HStack>

				{showForm ? (
					<CommandForm
						channels={overview.data?.channels ?? []}
						initial={editing ?? undefined}
						isSaving={create.isPending || update.isPending}
						roles={overview.data?.roles ?? []}
						onSubmit={handleSubmit}
						onCancel={() => {
							setShowForm(false);
							setEditing(null);
						}}
					/>
				) : (commands.data?.length ?? 0) === 0 ? (
					<Text color="text.subtle">No commands yet.</Text>
				) : (
					<Table size="sm">
						<Thead>
							<Tr>
								<Th>Trigger</Th>
								<Th>Type</Th>
								<Th>Enabled</Th>
								<Th />
							</Tr>
						</Thead>
						<Tbody>
							{commands.data?.map((c) => (
								<Tr key={c.id}>
									<Td>
										{prefix}
										{c.trigger}
									</Td>
									<Td>
										<Badge>{c.responseType}</Badge>
									</Td>
									<Td>{c.enabled ? "Yes" : "No"}</Td>
									<Td>
										<HStack>
											<Button
												size="xs"
												onClick={() => {
													setEditing(c);
													setShowForm(true);
												}}
											>
												Edit
											</Button>
											<Button
												colorScheme="red"
												size="xs"
												variant="ghost"
												onClick={() => {
													remove.mutate(c.id);
												}}
											>
												Delete
											</Button>
										</HStack>
									</Td>
								</Tr>
							))}
						</Tbody>
					</Table>
				)}
			</Box>
		</VStack>
	);
}
