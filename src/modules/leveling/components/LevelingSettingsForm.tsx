import {
	Box,
	Button,
	Divider,
	FormControl,
	FormLabel,
	HStack,
	NumberDecrementStepper,
	NumberIncrementStepper,
	NumberInput,
	NumberInputField,
	NumberInputStepper,
	Select,
	Switch,
	useToast,
	VStack,
} from "@chakra-ui/react";
import {
	useEffect,
	useState,
	type ChangeEvent,
	type ReactElement,
} from "react";
import { MultiSelect } from "@/components/MultiSelect";
import { useGuildOverview } from "@/modules/guilds/hooks/useGuildOverview";
import {
	useLevelingSettings,
	useUpdateLevelingSettings,
} from "@/modules/leveling/hooks/useLevelingSettings";

type Props = {
	guildId: string;
};

type NotificationMode = "channel" | "dm" | "off";
type LevelRoleMode = "stacking" | "replacing";

// Defaults used only until the GET resolves; effect below overwrites them.
const INITIAL = {
	enabled: false,
	xpMin: 15,
	xpMax: 25,
	cooldownSeconds: 60,
	minMessageLength: 0,
	ignoreEmojiOnly: true,
	ignoreLinkOnly: false,
	ignoredChannelIds: [] as Array<string>,
	ignoredRoleIds: [] as Array<string>,
	notificationMode: "off" as NotificationMode,
	notificationChannelId: "" as string,
	levelRoleMode: "stacking" as LevelRoleMode,
	// BE validates these regardless of the toggle, so defaults must be in-range
	// (percent 1–100, days ≥ 1) — matching the server's own defaults.
	xpDecayEnabled: false,
	xpDecayPercent: 10,
	xpDecayInactivityDays: 7,
};

export function LevelingSettingsForm({ guildId }: Props): ReactElement {
	const settings = useLevelingSettings(guildId);
	const overview = useGuildOverview(guildId);
	const update = useUpdateLevelingSettings(guildId);
	const toast = useToast();

	const [enabled, setEnabled] = useState<boolean>(INITIAL.enabled);
	const [xpMin, setXpMin] = useState<number>(INITIAL.xpMin);
	const [xpMax, setXpMax] = useState<number>(INITIAL.xpMax);
	const [cooldownSeconds, setCooldownSeconds] = useState<number>(
		INITIAL.cooldownSeconds
	);
	const [minMessageLength, setMinMessageLength] = useState<number>(
		INITIAL.minMessageLength
	);
	const [ignoreEmojiOnly, setIgnoreEmojiOnly] = useState<boolean>(
		INITIAL.ignoreEmojiOnly
	);
	const [ignoreLinkOnly, setIgnoreLinkOnly] = useState<boolean>(
		INITIAL.ignoreLinkOnly
	);
	const [ignoredChannelIds, setIgnoredChannelIds] = useState<Array<string>>(
		INITIAL.ignoredChannelIds
	);
	const [ignoredRoleIds, setIgnoredRoleIds] = useState<Array<string>>(
		INITIAL.ignoredRoleIds
	);
	const [notificationMode, setNotificationMode] = useState<NotificationMode>(
		INITIAL.notificationMode
	);
	const [notificationChannelId, setNotificationChannelId] = useState<string>(
		INITIAL.notificationChannelId
	);
	const [levelRoleMode, setLevelRoleMode] = useState<LevelRoleMode>(
		INITIAL.levelRoleMode
	);
	const [xpDecayEnabled, setXpDecayEnabled] = useState<boolean>(
		INITIAL.xpDecayEnabled
	);
	const [xpDecayPercent, setXpDecayPercent] = useState<number>(
		INITIAL.xpDecayPercent
	);
	const [xpDecayInactivityDays, setXpDecayInactivityDays] = useState<number>(
		INITIAL.xpDecayInactivityDays
	);

	// Sync server state once it loads; mirrors ModerationView.
	useEffect(() => {
		const data = settings.data;
		if (!data) return;
		setEnabled(data.enabled);
		setXpMin(data.xpMin);
		setXpMax(data.xpMax);
		setCooldownSeconds(data.cooldownSeconds);
		setMinMessageLength(data.minMessageLength);
		setIgnoreEmojiOnly(data.ignoreEmojiOnly);
		setIgnoreLinkOnly(data.ignoreLinkOnly);
		setIgnoredChannelIds(data.ignoredChannelIds);
		setIgnoredRoleIds(data.ignoredRoleIds);
		setNotificationMode(data.notificationMode);
		setNotificationChannelId(data.notificationChannelId ?? "");
		setLevelRoleMode(data.levelRoleMode);
		setXpDecayEnabled(data.xpDecayEnabled);
		setXpDecayPercent(data.xpDecayPercent);
		setXpDecayInactivityDays(data.xpDecayInactivityDays);
	}, [settings.data]);

	const channels = overview.data?.channels ?? [];
	const roles = overview.data?.roles ?? [];

	const channelOptions = channels.map((c) => ({
		value: c.id,
		label: `#${c.name}`,
	}));
	const roleOptions = roles.map((r) => ({ value: r.id, label: r.name }));

	// Soft client-side guards; BE remains the source of truth for hard validation.
	const xpRangeInvalid = xpMin > xpMax;
	const notificationChannelMissing =
		enabled && notificationMode === "channel" && notificationChannelId === "";
	const saveDisabled = xpRangeInvalid || notificationChannelMissing;

	const save = (): void => {
		update.mutate(
			{
				enabled,
				xpMin,
				xpMax,
				cooldownSeconds,
				minMessageLength,
				ignoreEmojiOnly,
				ignoreLinkOnly,
				ignoredChannelIds,
				ignoredRoleIds,
				notificationMode,
				// Persist null when not in channel mode so BE doesn't keep a stale id.
				notificationChannelId:
					notificationMode === "channel" ? notificationChannelId || null : null,
				levelRoleMode,
				xpDecayEnabled,
				xpDecayPercent,
				xpDecayInactivityDays,
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
				<FormControl alignItems="center" display="flex">
					<FormLabel mb={0}>Enable leveling</FormLabel>
					<Switch
						isChecked={enabled}
						onChange={(event_: ChangeEvent<HTMLInputElement>) => {
							setEnabled(event_.target.checked);
						}}
					/>
				</FormControl>
			</Box>

			<Box bg="bg.surface" borderRadius="2xl" boxShadow="sm" p={6}>
				<VStack align="stretch" spacing={4}>
					<HStack spacing={4}>
						<FormControl isInvalid={xpRangeInvalid}>
							<FormLabel>XP min</FormLabel>
							<NumberInput
								min={0}
								value={xpMin}
								onChange={(_, valueNumber: number) => {
									setXpMin(Number.isNaN(valueNumber) ? 0 : valueNumber);
								}}
							>
								<NumberInputField />
								<NumberInputStepper>
									<NumberIncrementStepper />
									<NumberDecrementStepper />
								</NumberInputStepper>
							</NumberInput>
						</FormControl>
						<FormControl isInvalid={xpRangeInvalid}>
							<FormLabel>XP max</FormLabel>
							<NumberInput
								min={0}
								value={xpMax}
								onChange={(_, valueNumber: number) => {
									setXpMax(Number.isNaN(valueNumber) ? 0 : valueNumber);
								}}
							>
								<NumberInputField />
								<NumberInputStepper>
									<NumberIncrementStepper />
									<NumberDecrementStepper />
								</NumberInputStepper>
							</NumberInput>
						</FormControl>
					</HStack>

					<FormControl>
						<FormLabel>Cooldown (seconds)</FormLabel>
						<NumberInput
							min={0}
							value={cooldownSeconds}
							onChange={(_, valueNumber: number) => {
								setCooldownSeconds(Number.isNaN(valueNumber) ? 0 : valueNumber);
							}}
						>
							<NumberInputField />
							<NumberInputStepper>
								<NumberIncrementStepper />
								<NumberDecrementStepper />
							</NumberInputStepper>
						</NumberInput>
					</FormControl>
				</VStack>
			</Box>

			<Box bg="bg.surface" borderRadius="2xl" boxShadow="sm" p={6}>
				<VStack align="stretch" spacing={4}>
					<FormControl>
						<FormLabel>Minimum message length</FormLabel>
						<NumberInput
							min={0}
							value={minMessageLength}
							onChange={(_, valueNumber: number) => {
								setMinMessageLength(
									Number.isNaN(valueNumber) ? 0 : valueNumber
								);
							}}
						>
							<NumberInputField />
							<NumberInputStepper>
								<NumberIncrementStepper />
								<NumberDecrementStepper />
							</NumberInputStepper>
						</NumberInput>
					</FormControl>

					<FormControl alignItems="center" display="flex">
						<FormLabel mb={0}>Ignore emoji-only messages</FormLabel>
						<Switch
							isChecked={ignoreEmojiOnly}
							onChange={(event_: ChangeEvent<HTMLInputElement>) => {
								setIgnoreEmojiOnly(event_.target.checked);
							}}
						/>
					</FormControl>

					<FormControl alignItems="center" display="flex">
						<FormLabel mb={0}>Ignore link-only messages</FormLabel>
						<Switch
							isChecked={ignoreLinkOnly}
							onChange={(event_: ChangeEvent<HTMLInputElement>) => {
								setIgnoreLinkOnly(event_.target.checked);
							}}
						/>
					</FormControl>
				</VStack>
			</Box>

			<Box bg="bg.surface" borderRadius="2xl" boxShadow="sm" p={6}>
				<VStack align="stretch" spacing={4}>
					<FormControl>
						<FormLabel>Notification mode</FormLabel>
						<Select
							value={notificationMode}
							onChange={(event_: ChangeEvent<HTMLSelectElement>) => {
								setNotificationMode(event_.target.value as NotificationMode);
							}}
						>
							<option value="channel">Channel</option>
							<option value="dm">Direct message</option>
							<option value="off">Off</option>
						</Select>
					</FormControl>

					{notificationMode === "channel" && (
						<FormControl isInvalid={notificationChannelMissing}>
							<FormLabel>Notification channel</FormLabel>
							<Select
								placeholder="Select channel"
								value={notificationChannelId}
								onChange={(event_: ChangeEvent<HTMLSelectElement>) => {
									setNotificationChannelId(event_.target.value);
								}}
							>
								{channels.map((c) => (
									<option key={c.id} value={c.id}>
										#{c.name}
									</option>
								))}
							</Select>
						</FormControl>
					)}
				</VStack>
			</Box>

			<Box bg="bg.surface" borderRadius="2xl" boxShadow="sm" p={6}>
				<FormControl>
					<FormLabel>Level role mode</FormLabel>
					<Select
						value={levelRoleMode}
						onChange={(event_: ChangeEvent<HTMLSelectElement>) => {
							setLevelRoleMode(event_.target.value as LevelRoleMode);
						}}
					>
						<option value="stacking">Stacking — keep all earned roles</option>
						<option value="replacing">
							Replacing — only keep the highest role
						</option>
					</Select>
				</FormControl>
			</Box>

			<Box bg="bg.surface" borderRadius="2xl" boxShadow="sm" p={6}>
				<VStack align="stretch" spacing={4}>
					<FormControl alignItems="center" display="flex">
						<FormLabel mb={0}>Enable XP decay</FormLabel>
						<Switch
							isChecked={xpDecayEnabled}
							onChange={(event_: ChangeEvent<HTMLInputElement>) => {
								setXpDecayEnabled(event_.target.checked);
							}}
						/>
					</FormControl>

					{xpDecayEnabled && (
						<HStack spacing={4}>
							<FormControl>
								<FormLabel>Decay percent (%)</FormLabel>
								<NumberInput
									max={100}
									min={1}
									value={xpDecayPercent}
									onChange={(_, valueNumber: number) => {
										setXpDecayPercent(
											Number.isNaN(valueNumber) ? 1 : valueNumber
										);
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
								<FormLabel>Inactivity days before decay</FormLabel>
								<NumberInput
									min={1}
									value={xpDecayInactivityDays}
									onChange={(_, valueNumber: number) => {
										setXpDecayInactivityDays(
											Number.isNaN(valueNumber) ? 1 : valueNumber
										);
									}}
								>
									<NumberInputField />
									<NumberInputStepper>
										<NumberIncrementStepper />
										<NumberDecrementStepper />
									</NumberInputStepper>
								</NumberInput>
							</FormControl>
						</HStack>
					)}
				</VStack>
			</Box>

			<Box bg="bg.surface" borderRadius="2xl" boxShadow="sm" p={6}>
				<VStack align="stretch" spacing={4}>
					<FormControl>
						<FormLabel>Ignored channels</FormLabel>
						<MultiSelect
							emptyLabel="No channels ignored"
							options={channelOptions}
							value={ignoredChannelIds}
							onChange={setIgnoredChannelIds}
						/>
					</FormControl>

					<FormControl>
						<FormLabel>Ignored roles</FormLabel>
						<MultiSelect
							emptyLabel="No roles ignored"
							options={roleOptions}
							value={ignoredRoleIds}
							onChange={setIgnoredRoleIds}
						/>
					</FormControl>
				</VStack>
			</Box>

			<Divider />

			<Box>
				<Button
					colorScheme="purple"
					isDisabled={saveDisabled}
					isLoading={update.isPending}
					onClick={save}
				>
					Save settings
				</Button>
			</Box>
		</VStack>
	);
}
