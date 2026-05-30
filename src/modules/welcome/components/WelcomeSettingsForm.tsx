import {
	Box,
	Button,
	Divider,
	FormControl,
	FormLabel,
	Select,
	Switch,
	Textarea,
	useToast,
	VStack,
} from "@chakra-ui/react";
import {
	useEffect,
	useState,
	type ChangeEvent,
	type ReactElement,
} from "react";
import { useGuildOverview } from "@/modules/guilds/hooks/useGuildOverview";
import {
	useUpdateWelcomeSettings,
	useWelcomeSettings,
} from "@/modules/welcome/hooks/useWelcome";

type Props = {
	guildId: string;
};

const INITIAL = {
	enabled: false,
	channelId: "",
	welcomeTemplate: "Chào mừng {user} đến với {server}! 🎉 Bạn là thành viên thứ {count}.",
	aiWelcome: false,
	leaveEnabled: false,
	leaveTemplate: "{user} đã rời khỏi **{server}**. 👋",
};

export function WelcomeSettingsForm({ guildId }: Props): ReactElement {
	const settings = useWelcomeSettings(guildId);
	const update = useUpdateWelcomeSettings(guildId);
	const overview = useGuildOverview(guildId);
	const toast = useToast();

	const [enabled, setEnabled] = useState<boolean>(INITIAL.enabled);
	const [channelId, setChannelId] = useState<string>(INITIAL.channelId);
	const [welcomeTemplate, setWelcomeTemplate] = useState<string>(
		INITIAL.welcomeTemplate
	);
	const [aiWelcome, setAiWelcome] = useState<boolean>(INITIAL.aiWelcome);
	const [leaveEnabled, setLeaveEnabled] = useState<boolean>(INITIAL.leaveEnabled);
	const [leaveTemplate, setLeaveTemplate] = useState<string>(
		INITIAL.leaveTemplate
	);

	const channels = overview.data?.channels ?? [];

	useEffect(() => {
		const data = settings.data;
		if (!data) return;
		setEnabled(data.enabled);
		setChannelId(data.channelId ?? "");
		setWelcomeTemplate(data.welcomeTemplate);
		setAiWelcome(data.aiWelcome);
		setLeaveEnabled(data.leaveEnabled);
		setLeaveTemplate(data.leaveTemplate);
	}, [settings.data]);

	const channelMissing = enabled && channelId === "";

	const save = (): void => {
		update.mutate(
			{
				enabled,
				channelId: channelId || null,
				welcomeTemplate,
				aiWelcome,
				leaveEnabled,
				leaveTemplate,
			},
			{
				onSuccess: () => {
					toast({ status: "success", title: "Saved" });
				},
			}
		);
	};

	return (
		<VStack align="stretch" spacing={6}>
			<Box bg="bg.surface" borderRadius="2xl" boxShadow="sm" p={6}>
				<VStack align="stretch" spacing={4}>
					<FormControl alignItems="center" display="flex">
						<FormLabel mb={0}>Enable welcome</FormLabel>
						<Switch
							isChecked={enabled}
							onChange={(event_: ChangeEvent<HTMLInputElement>) => {
								setEnabled(event_.target.checked);
							}}
						/>
					</FormControl>

					<FormControl isInvalid={channelMissing}>
						<FormLabel>Channel</FormLabel>
						<Select
							placeholder="Chọn kênh…"
							value={channelId}
							onChange={(event_: ChangeEvent<HTMLSelectElement>) => {
								setChannelId(event_.target.value);
							}}
						>
							{channels.map((c) => (
								<option key={c.id} value={c.id}>
									#{c.name}
								</option>
							))}
						</Select>
					</FormControl>
				</VStack>
			</Box>

			<Box bg="bg.surface" borderRadius="2xl" boxShadow="sm" p={6}>
				<VStack align="stretch" spacing={4}>
					<FormControl>
						<FormLabel>Welcome template</FormLabel>
						<Textarea
							rows={2}
							value={welcomeTemplate}
							onChange={(event_: ChangeEvent<HTMLTextAreaElement>) => {
								setWelcomeTemplate(event_.target.value);
							}}
						/>
					</FormControl>
					<FormControl alignItems="center" display="flex">
						<FormLabel mb={0}>AI-generated welcome</FormLabel>
						<Switch
							isChecked={aiWelcome}
							onChange={(event_: ChangeEvent<HTMLInputElement>) => {
								setAiWelcome(event_.target.checked);
							}}
						/>
					</FormControl>
				</VStack>
			</Box>

			<Box bg="bg.surface" borderRadius="2xl" boxShadow="sm" p={6}>
				<VStack align="stretch" spacing={4}>
					<FormControl alignItems="center" display="flex">
						<FormLabel mb={0}>Enable leave message</FormLabel>
						<Switch
							isChecked={leaveEnabled}
							onChange={(event_: ChangeEvent<HTMLInputElement>) => {
								setLeaveEnabled(event_.target.checked);
							}}
						/>
					</FormControl>
					<FormControl>
						<FormLabel>Leave template</FormLabel>
						<Textarea
							rows={2}
							value={leaveTemplate}
							onChange={(event_: ChangeEvent<HTMLTextAreaElement>) => {
								setLeaveTemplate(event_.target.value);
							}}
						/>
					</FormControl>
				</VStack>
			</Box>

			<Divider />

			<Box>
				<Button
					colorScheme="purple"
					isDisabled={channelMissing}
					isLoading={update.isPending}
					onClick={save}
				>
					Save settings
				</Button>
			</Box>
		</VStack>
	);
}
