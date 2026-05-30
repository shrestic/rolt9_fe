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
	useMinigameSettings,
	useUpdateMinigameSettings,
} from "@/modules/minigame/hooks/useMinigame";

type Props = {
	guildId: string;
};

// Defaults until the GET resolves; the effect overwrites with server values.
const INITIAL = {
	enabled: false,
	minBet: 10,
	maxBet: 10_000,
};

export function MinigameSettingsForm({ guildId }: Props): ReactElement {
	const settings = useMinigameSettings(guildId);
	const update = useUpdateMinigameSettings(guildId);
	const toast = useToast();

	const [enabled, setEnabled] = useState<boolean>(INITIAL.enabled);
	const [minBet, setMinBet] = useState<number>(INITIAL.minBet);
	const [maxBet, setMaxBet] = useState<number>(INITIAL.maxBet);

	useEffect(() => {
		const data = settings.data;
		if (!data) return;
		setEnabled(data.enabled);
		setMinBet(data.minBet);
		setMaxBet(data.maxBet);
	}, [settings.data]);

	// Soft client-side guard; BE is the source of truth for hard validation.
	const betRangeInvalid = minBet > maxBet;

	const save = (): void => {
		update.mutate(
			{ enabled, minBet, maxBet },
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
					<FormLabel mb={0}>Enable mini-games</FormLabel>
					<Switch
						isChecked={enabled}
						onChange={(event_: ChangeEvent<HTMLInputElement>) => {
							setEnabled(event_.target.checked);
						}}
					/>
				</FormControl>
			</Box>

			<Box bg="bg.surface" borderRadius="2xl" boxShadow="sm" p={6}>
				<HStack spacing={4}>
					<FormControl isInvalid={betRangeInvalid}>
						<FormLabel>Min bet</FormLabel>
						<NumberInput
							min={1}
							value={minBet}
							onChange={(_, valueNumber: number) => {
								setMinBet(Number.isNaN(valueNumber) ? 1 : valueNumber);
							}}
						>
							<NumberInputField />
							<NumberInputStepper>
								<NumberIncrementStepper />
								<NumberDecrementStepper />
							</NumberInputStepper>
						</NumberInput>
					</FormControl>
					<FormControl isInvalid={betRangeInvalid}>
						<FormLabel>Max bet</FormLabel>
						<NumberInput
							min={1}
							value={maxBet}
							onChange={(_, valueNumber: number) => {
								setMaxBet(Number.isNaN(valueNumber) ? 1 : valueNumber);
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
			</Box>

			<Divider />

			<Box>
				<Button
					colorScheme="purple"
					isDisabled={betRangeInvalid}
					isLoading={update.isPending}
					onClick={save}
				>
					Save settings
				</Button>
			</Box>
		</VStack>
	);
}
