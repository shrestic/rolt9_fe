import {
	Box,
	Button,
	Divider,
	FormControl,
	FormLabel,
	HStack,
	Input,
	NumberDecrementStepper,
	NumberIncrementStepper,
	NumberInput,
	NumberInputField,
	NumberInputStepper,
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
import {
	useCurrencySettings,
	useUpdateCurrencySettings,
} from "@/modules/currency/hooks/useCurrencySettings";

type Props = {
	guildId: string;
};

// Defaults used only until the GET resolves; the effect below overwrites them
// with the server values. These mirror the backend's own defaults.
const INITIAL = {
	enabled: false,
	currencyName: "coins",
	currencyEmoji: "🪙",
	earnMin: 1,
	earnMax: 3,
	dailyAmount: 100,
	allowPay: true,
	streakEnabled: true,
	streakBonusPerDay: 10,
	streakBonusCap: 500,
};

export function CurrencySettingsForm({ guildId }: Props): ReactElement {
	const settings = useCurrencySettings(guildId);
	const update = useUpdateCurrencySettings(guildId);
	const toast = useToast();

	const [enabled, setEnabled] = useState<boolean>(INITIAL.enabled);
	const [currencyName, setCurrencyName] = useState<string>(
		INITIAL.currencyName
	);
	const [currencyEmoji, setCurrencyEmoji] = useState<string>(
		INITIAL.currencyEmoji
	);
	const [earnMin, setEarnMin] = useState<number>(INITIAL.earnMin);
	const [earnMax, setEarnMax] = useState<number>(INITIAL.earnMax);
	const [dailyAmount, setDailyAmount] = useState<number>(INITIAL.dailyAmount);
	const [allowPay, setAllowPay] = useState<boolean>(INITIAL.allowPay);
	const [streakEnabled, setStreakEnabled] = useState<boolean>(
		INITIAL.streakEnabled
	);
	const [streakBonusPerDay, setStreakBonusPerDay] = useState<number>(
		INITIAL.streakBonusPerDay
	);
	const [streakBonusCap, setStreakBonusCap] = useState<number>(
		INITIAL.streakBonusCap
	);

	// Sync server state once it loads; mirrors LevelingSettingsForm.
	useEffect(() => {
		const data = settings.data;
		if (!data) return;
		setEnabled(data.enabled);
		setCurrencyName(data.currencyName);
		setCurrencyEmoji(data.currencyEmoji);
		setEarnMin(data.earnMin);
		setEarnMax(data.earnMax);
		setDailyAmount(data.dailyAmount);
		setAllowPay(data.allowPay);
		setStreakEnabled(data.streakEnabled);
		setStreakBonusPerDay(data.streakBonusPerDay);
		setStreakBonusCap(data.streakBonusCap);
	}, [settings.data]);

	// Soft client-side guard; BE remains the source of truth for hard validation.
	const earnRangeInvalid = earnMin > earnMax;
	const saveDisabled = earnRangeInvalid;

	const save = (): void => {
		update.mutate(
			{
				enabled,
				currencyName,
				currencyEmoji,
				earnMin,
				earnMax,
				dailyAmount,
				allowPay,
				streakEnabled,
				streakBonusPerDay,
				streakBonusCap,
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
					<FormLabel mb={0}>Enable currency</FormLabel>
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
					<FormControl>
						<FormLabel>Currency name</FormLabel>
						<Input
							value={currencyName}
							onChange={(event_: ChangeEvent<HTMLInputElement>) => {
								setCurrencyName(event_.target.value);
							}}
						/>
					</FormControl>

					<FormControl>
						<FormLabel>Currency emoji</FormLabel>
						<Input
							value={currencyEmoji}
							onChange={(event_: ChangeEvent<HTMLInputElement>) => {
								setCurrencyEmoji(event_.target.value);
							}}
						/>
					</FormControl>
				</VStack>
			</Box>

			<Box bg="bg.surface" borderRadius="2xl" boxShadow="sm" p={6}>
				<VStack align="stretch" spacing={4}>
					<HStack spacing={4}>
						<FormControl isInvalid={earnRangeInvalid}>
							<FormLabel>Earn min</FormLabel>
							<NumberInput
								min={0}
								value={earnMin}
								onChange={(_, valueNumber: number) => {
									setEarnMin(Number.isNaN(valueNumber) ? 0 : valueNumber);
								}}
							>
								<NumberInputField />
								<NumberInputStepper>
									<NumberIncrementStepper />
									<NumberDecrementStepper />
								</NumberInputStepper>
							</NumberInput>
						</FormControl>
						<FormControl isInvalid={earnRangeInvalid}>
							<FormLabel>Earn max</FormLabel>
							<NumberInput
								min={0}
								value={earnMax}
								onChange={(_, valueNumber: number) => {
									setEarnMax(Number.isNaN(valueNumber) ? 0 : valueNumber);
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
						<FormLabel>Daily amount</FormLabel>
						<NumberInput
							min={0}
							value={dailyAmount}
							onChange={(_, valueNumber: number) => {
								setDailyAmount(Number.isNaN(valueNumber) ? 0 : valueNumber);
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
				<FormControl alignItems="center" display="flex">
					<FormLabel mb={0}>Allow members to pay each other</FormLabel>
					<Switch
						isChecked={allowPay}
						onChange={(event_: ChangeEvent<HTMLInputElement>) => {
							setAllowPay(event_.target.checked);
						}}
					/>
				</FormControl>
			</Box>

			<Box bg="bg.surface" borderRadius="2xl" boxShadow="sm" p={6}>
				<VStack align="stretch" spacing={4}>
					<FormControl alignItems="center" display="flex">
						<FormLabel mb={0}>Enable daily streak</FormLabel>
						<Switch
							isChecked={streakEnabled}
							onChange={(event_: ChangeEvent<HTMLInputElement>) => {
								setStreakEnabled(event_.target.checked);
							}}
						/>
					</FormControl>
					<HStack spacing={4}>
						<FormControl>
							<FormLabel>Streak bonus / day</FormLabel>
							<NumberInput
								min={0}
								value={streakBonusPerDay}
								onChange={(_, valueNumber: number) => {
									setStreakBonusPerDay(
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
						<FormControl>
							<FormLabel>Streak bonus cap</FormLabel>
							<NumberInput
								min={0}
								value={streakBonusCap}
								onChange={(_, valueNumber: number) => {
									setStreakBonusCap(
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
					</HStack>
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
