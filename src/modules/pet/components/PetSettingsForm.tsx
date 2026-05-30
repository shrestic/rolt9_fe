import {
	Box,
	Button,
	Divider,
	FormControl,
	FormLabel,
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
	usePetSettings,
	useUpdatePetSettings,
} from "@/modules/pet/hooks/usePet";

type Props = {
	guildId: string;
};

// Defaults used only until the GET resolves; the effect below overwrites them
// with the server values. These mirror the backend's own defaults.
const INITIAL = {
	enabled: false,
	name: "Rolt",
	feedCost: 50,
	feedAmount: 20,
	playAmount: 20,
	decayPerDay: 5,
};

export function PetSettingsForm({ guildId }: Props): ReactElement {
	const settings = usePetSettings(guildId);
	const update = useUpdatePetSettings(guildId);
	const toast = useToast();

	const [enabled, setEnabled] = useState<boolean>(INITIAL.enabled);
	const [name, setName] = useState<string>(INITIAL.name);
	const [feedCost, setFeedCost] = useState<number>(INITIAL.feedCost);
	const [feedAmount, setFeedAmount] = useState<number>(INITIAL.feedAmount);
	const [playAmount, setPlayAmount] = useState<number>(INITIAL.playAmount);
	const [decayPerDay, setDecayPerDay] = useState<number>(INITIAL.decayPerDay);

	// Sync server state once it loads; mirrors CurrencySettingsForm.
	useEffect(() => {
		const data = settings.data;
		if (!data) return;
		setEnabled(data.enabled);
		setName(data.name);
		setFeedCost(data.feedCost);
		setFeedAmount(data.feedAmount);
		setPlayAmount(data.playAmount);
		setDecayPerDay(data.decayPerDay);
	}, [settings.data]);

	const save = (): void => {
		update.mutate(
			{ enabled, name, feedCost, feedAmount, playAmount, decayPerDay },
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
					<FormLabel mb={0}>Enable pet</FormLabel>
					<Switch
						isChecked={enabled}
						onChange={(event_: ChangeEvent<HTMLInputElement>) => {
							setEnabled(event_.target.checked);
						}}
					/>
				</FormControl>
			</Box>

			<Box bg="bg.surface" borderRadius="2xl" boxShadow="sm" p={6}>
				<FormControl>
					<FormLabel>Pet name</FormLabel>
					<Input
						value={name}
						onChange={(event_: ChangeEvent<HTMLInputElement>) => {
							setName(event_.target.value);
						}}
					/>
				</FormControl>
			</Box>

			<Box bg="bg.surface" borderRadius="2xl" boxShadow="sm" p={6}>
				<VStack align="stretch" spacing={4}>
					{/* Feed cost: how many coins members spend to feed the pet once. */}
					<FormControl>
						<FormLabel>Feed cost (coins)</FormLabel>
						<NumberInput
							min={0}
							value={feedCost}
							onChange={(_, valueNumber: number) => {
								setFeedCost(Number.isNaN(valueNumber) ? 0 : valueNumber);
							}}
						>
							<NumberInputField />
							<NumberInputStepper>
								<NumberIncrementStepper />
								<NumberDecrementStepper />
							</NumberInputStepper>
						</NumberInput>
					</FormControl>

					{/* Feed amount: hunger points restored per feed. */}
					<FormControl>
						<FormLabel>Feed amount (hunger points)</FormLabel>
						<NumberInput
							min={0}
							value={feedAmount}
							onChange={(_, valueNumber: number) => {
								setFeedAmount(Number.isNaN(valueNumber) ? 0 : valueNumber);
							}}
						>
							<NumberInputField />
							<NumberInputStepper>
								<NumberIncrementStepper />
								<NumberDecrementStepper />
							</NumberInputStepper>
						</NumberInput>
					</FormControl>

					{/* Play amount: happiness points restored per play action. */}
					<FormControl>
						<FormLabel>Play amount (happiness points)</FormLabel>
						<NumberInput
							min={0}
							value={playAmount}
							onChange={(_, valueNumber: number) => {
								setPlayAmount(Number.isNaN(valueNumber) ? 0 : valueNumber);
							}}
						>
							<NumberInputField />
							<NumberInputStepper>
								<NumberIncrementStepper />
								<NumberDecrementStepper />
							</NumberInputStepper>
						</NumberInput>
					</FormControl>

					{/* Decay per day: points lost from both stats each calendar day. */}
					<FormControl>
						<FormLabel>Decay per day</FormLabel>
						<NumberInput
							min={0}
							value={decayPerDay}
							onChange={(_, valueNumber: number) => {
								setDecayPerDay(Number.isNaN(valueNumber) ? 0 : valueNumber);
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

			<Divider />

			<Box>
				<Button
					colorScheme="purple"
					isLoading={update.isPending}
					onClick={save}
				>
					Save settings
				</Button>
			</Box>
		</VStack>
	);
}
