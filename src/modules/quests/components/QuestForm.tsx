import {
	Button,
	FormControl,
	FormErrorMessage,
	FormLabel,
	HStack,
	Input,
	NumberDecrementStepper,
	NumberIncrementStepper,
	NumberInput,
	NumberInputField,
	NumberInputStepper,
	Select,
	Switch,
	Textarea,
	VStack,
} from "@chakra-ui/react";
import {
	useState,
	type ChangeEvent,
	type FormEvent,
	type ReactElement,
} from "react";
import type { Quest, QuestInput } from "@/data/models/quests";

type Props = {
	// When present the form is in edit mode and fields are pre-populated.
	initial?: Quest;
	onSubmit: (input: QuestInput) => void;
	onCancel: () => void;
	// True while the parent mutation is in flight — disables the save button.
	isLoading?: boolean;
};

// Human-readable labels for the objective type dropdown.
// The keys are snake_case wire values; camelcase rule is suppressed intentionally.
const OBJECTIVE_LABELS: Record<QuestInput["objectiveType"], string> = {
	// eslint-disable-next-line camelcase
	earn_coins: "Kiếm coin",
	// eslint-disable-next-line camelcase
	daily_claim: "Điểm danh",
};

// Default field values for the "create" flow (no `initial` prop).
const DEFAULTS: Omit<QuestInput, "name"> = {
	description: null,
	period: "daily",
	objectiveType: "earn_coins",
	target: 1,
	rewardCoins: 0,
	enabled: true,
};

// A controlled form for creating or editing a quest. Client-side validation
// guards name non-empty and target ≥ 1; the backend enforces hard limits.
export function QuestForm({
	initial,
	onSubmit,
	onCancel,
	isLoading = false,
}: Props): ReactElement {
	const [name, setName] = useState<string>(initial?.name ?? "");
	const [description, setDescription] = useState<string>(
		initial?.description ?? ""
	);
	const [period, setPeriod] = useState<QuestInput["period"]>(
		initial?.period ?? DEFAULTS.period
	);
	const [objectiveType, setObjectiveType] = useState<
		QuestInput["objectiveType"]
	>(initial?.objectiveType ?? DEFAULTS.objectiveType);
	const [target, setTarget] = useState<number>(
		initial?.target ?? DEFAULTS.target
	);
	const [rewardCoins, setRewardCoins] = useState<number>(
		initial?.rewardCoins ?? DEFAULTS.rewardCoins
	);
	const [enabled, setEnabled] = useState<boolean>(
		initial?.enabled ?? DEFAULTS.enabled
	);

	// Track whether the user has tried to submit so we only show errors after
	// the first submit attempt, not on initial render.
	const [submitted, setSubmitted] = useState<boolean>(false);

	const nameInvalid = name.trim().length === 0;
	const targetInvalid = target < 1;

	const handleSubmit = (event_: FormEvent): void => {
		event_.preventDefault();
		setSubmitted(true);
		if (nameInvalid || targetInvalid) return;

		onSubmit({
			name: name.trim(),
			// Store empty description string as null so the API receives null.
			description: description.trim() === "" ? null : description.trim(),
			period,
			objectiveType,
			target,
			rewardCoins,
			enabled,
		});
	};

	return (
		<VStack
			align="stretch"
			as="form"
			spacing={4}
			onSubmit={handleSubmit}
		>
			{/* Quest name — required */}
			<FormControl isRequired isInvalid={submitted && nameInvalid}>
				<FormLabel>Name</FormLabel>
				<Input
					placeholder="Daily Earner"
					value={name}
					onChange={(event_: ChangeEvent<HTMLInputElement>) => {
						setName(event_.target.value);
					}}
				/>
				<FormErrorMessage>Name is required.</FormErrorMessage>
			</FormControl>

			{/* Optional description */}
			<FormControl>
				<FormLabel>Description</FormLabel>
				<Textarea
					placeholder="Earn coins by chatting every day"
					resize="vertical"
					value={description}
					onChange={(event_: ChangeEvent<HTMLTextAreaElement>) => {
						setDescription(event_.target.value);
					}}
				/>
			</FormControl>

			<HStack align="flex-start" spacing={4}>
				{/* Reset period */}
				<FormControl>
					<FormLabel>Period</FormLabel>
					<Select
						value={period}
						onChange={(event_: ChangeEvent<HTMLSelectElement>) => {
							setPeriod(event_.target.value as QuestInput["period"]);
						}}
					>
						<option value="daily">Daily</option>
						<option value="weekly">Weekly</option>
					</Select>
				</FormControl>

				{/* What the member must do */}
				<FormControl>
					<FormLabel>Objective</FormLabel>
					<Select
						value={objectiveType}
						onChange={(event_: ChangeEvent<HTMLSelectElement>) => {
							setObjectiveType(
								event_.target.value as QuestInput["objectiveType"]
							);
						}}
					>
						{Object.entries(OBJECTIVE_LABELS).map(([value, label]) => (
							<option key={value} value={value}>
								{label}
							</option>
						))}
					</Select>
				</FormControl>
			</HStack>

			<HStack align="flex-start" spacing={4}>
				{/* How many units to accumulate */}
				<FormControl isInvalid={submitted && targetInvalid}>
					<FormLabel>Target</FormLabel>
					<NumberInput
						min={1}
						value={target}
						onChange={(_, valueNumber: number) => {
							setTarget(Number.isNaN(valueNumber) ? 1 : valueNumber);
						}}
					>
						<NumberInputField />
						<NumberInputStepper>
							<NumberIncrementStepper />
							<NumberDecrementStepper />
						</NumberInputStepper>
					</NumberInput>
					<FormErrorMessage>Target must be at least 1.</FormErrorMessage>
				</FormControl>

				{/* Coins rewarded upon completion */}
				<FormControl>
					<FormLabel>Reward (coins)</FormLabel>
					<NumberInput
						min={0}
						value={rewardCoins}
						onChange={(_, valueNumber: number) => {
							setRewardCoins(Number.isNaN(valueNumber) ? 0 : valueNumber);
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

			{/* Active toggle */}
			<FormControl alignItems="center" display="flex">
				<FormLabel mb={0}>Enabled</FormLabel>
				<Switch
					isChecked={enabled}
					onChange={(event_: ChangeEvent<HTMLInputElement>) => {
						setEnabled(event_.target.checked);
					}}
				/>
			</FormControl>

			{/* Action row */}
			<HStack spacing={3}>
				<Button
					colorScheme="purple"
					isLoading={isLoading}
					type="submit"
				>
					Save
				</Button>
				<Button variant="ghost" onClick={onCancel}>
					Cancel
				</Button>
			</HStack>
		</VStack>
	);
}
