import {
	Box,
	Button,
	Divider,
	FormControl,
	FormLabel,
	NumberDecrementStepper,
	NumberIncrementStepper,
	NumberInput,
	NumberInputField,
	NumberInputStepper,
	Switch,
	Text,
	useToast,
	VStack,
} from "@chakra-ui/react";
import {
	useEffect,
	useState,
	type ChangeEvent,
	type ReactElement,
} from "react";
import { useAiSettings, useUpdateAiSettings } from "@/modules/ai/hooks/useAi";

type Props = {
	guildId: string;
};

const INITIAL = {
	enabled: false,
	monthlyTokenBudget: 100_000,
};

export function AiSettingsForm({ guildId }: Props): ReactElement {
	const settings = useAiSettings(guildId);
	const update = useUpdateAiSettings(guildId);
	const toast = useToast();

	const [enabled, setEnabled] = useState<boolean>(INITIAL.enabled);
	const [monthlyTokenBudget, setMonthlyTokenBudget] = useState<number>(
		INITIAL.monthlyTokenBudget
	);
	const used = settings.data?.tokensUsedThisMonth ?? 0;

	useEffect(() => {
		const data = settings.data;
		if (!data) return;
		setEnabled(data.enabled);
		setMonthlyTokenBudget(data.monthlyTokenBudget);
	}, [settings.data]);

	const save = (): void => {
		update.mutate(
			{ enabled, monthlyTokenBudget },
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
					<FormLabel mb={0}>Enable AI</FormLabel>
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
						<FormLabel>Monthly token budget</FormLabel>
						<NumberInput
							min={0}
							value={monthlyTokenBudget}
							onChange={(_, valueNumber: number) => {
								setMonthlyTokenBudget(
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
					<Text color="fg.muted" fontSize="sm">
						Đã dùng {used.toLocaleString()} /{" "}
						{monthlyTokenBudget.toLocaleString()} token tháng này.
					</Text>
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
