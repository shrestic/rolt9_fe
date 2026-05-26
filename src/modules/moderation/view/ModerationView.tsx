import {
	Box,
	Button,
	Divider,
	FormControl,
	FormLabel,
	Heading,
	HStack,
	Select,
	Switch,
	useToast,
	VStack,
} from "@chakra-ui/react";
import { useParams } from "@tanstack/react-router";
import { useEffect, useState, type ChangeEvent, type ReactElement } from "react";
import { useGuildOverview } from "@/modules/guilds/hooks/useGuildOverview";
import { CaseTable } from "@/modules/moderation/components/CaseTable";
import { EscalationRulesEditor } from "@/modules/moderation/components/EscalationRulesEditor";
import { useCases, useDeactivateCase } from "@/modules/moderation/hooks/useCases";
import {
	useModerationSettings,
	useUpdateModerationSettings,
} from "@/modules/moderation/hooks/useModerationSettings";
import type { EscalationRule } from "@/data/models/moderation";

const ACTIONS = ["ban", "kick", "mute", "unmute", "unban", "warn"];

export function ModerationView(): ReactElement {
	const { guildId } = useParams({ from: "/dashboard/$guildId/moderation" });
	const settings = useModerationSettings(guildId);
	const overview = useGuildOverview(guildId);
	const update = useUpdateModerationSettings(guildId);
	const toast = useToast();

	const [channelId, setChannelId] = useState("");
	const [dmOnAction, setDmOnAction] = useState(true);
	const [rules, setRules] = useState<Array<EscalationRule>>([]);
	const [actionFilter, setActionFilter] = useState("");

	useEffect(() => {
		if (settings.data) {
			setChannelId(settings.data.modLogChannelId ?? "");
			setDmOnAction(settings.data.dmOnAction);
			setRules(settings.data.warnEscalation);
		}
	}, [settings.data]);

	const cases = useCases(guildId, { action: actionFilter || undefined });
	const deactivate = useDeactivateCase(guildId);

	const save = (): void => {
		update.mutate(
			{ modLogChannelId: channelId || null, dmOnAction, warnEscalation: rules },
			{
				onSuccess: () => {
					toast({ status: "success", title: "Saved" });
				},
			}
		);
	};

	return (
		<VStack align="stretch" spacing={8}>
			<Heading size="md">Moderation</Heading>

			<Box bg="white" borderRadius="2xl" boxShadow="sm" p={6}>
				<VStack align="stretch" spacing={4}>
					<FormControl>
						<FormLabel>Mod-log channel</FormLabel>
						<Select
							placeholder="None"
							value={channelId}
							onChange={(event_: ChangeEvent<HTMLSelectElement>) => {
								setChannelId(event_.target.value);
							}}
						>
							{overview.data?.channels.map((c) => (
								<option key={c.id} value={c.id}>
									#{c.name}
								</option>
							))}
						</Select>
					</FormControl>

					<FormControl alignItems="center" display="flex">
						<FormLabel mb={0}>DM the user on action</FormLabel>
						<Switch
							isChecked={dmOnAction}
							onChange={(event_: ChangeEvent<HTMLInputElement>) => {
								setDmOnAction(event_.target.checked);
							}}
						/>
					</FormControl>

					<Box>
						<FormLabel>Warning escalation</FormLabel>
						<EscalationRulesEditor rules={rules} onChange={setRules} />
					</Box>

					<Box>
						<Button colorScheme="purple" isLoading={update.isPending} onClick={save}>
							Save settings
						</Button>
					</Box>
				</VStack>
			</Box>

			<Divider />

			<Box bg="white" borderRadius="2xl" boxShadow="sm" p={6}>
				<HStack justify="space-between" mb={4}>
					<Heading size="sm">Case history</Heading>
					<Select
						maxW="170px"
						placeholder="All actions"
						value={actionFilter}
						onChange={(event_: ChangeEvent<HTMLSelectElement>) => {
							setActionFilter(event_.target.value);
						}}
					>
						{ACTIONS.map((a) => (
							<option key={a} value={a}>
								{a}
							</option>
						))}
					</Select>
				</HStack>
				<CaseTable
					cases={cases.data?.items ?? []}
					onDeactivate={(n) => {
						deactivate.mutate(n);
					}}
				/>
			</Box>
		</VStack>
	);
}
