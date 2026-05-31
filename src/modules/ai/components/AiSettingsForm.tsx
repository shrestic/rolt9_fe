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
	Select,
	Switch,
	Text,
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
	useAiCatalog,
	useAiSettings,
	useUpdateAiSettings,
} from "@/modules/ai/hooks/useAi";

type Props = {
	guildId: string;
};

const INITIAL = {
	enabled: false,
	provider: "",
	model: "",
	monthlyBudgetUsd: 5,
	persona: "",
};

export function AiSettingsForm({ guildId }: Props): ReactElement {
	const settings = useAiSettings(guildId);
	const catalog = useAiCatalog();
	const update = useUpdateAiSettings(guildId);
	const toast = useToast();

	const [enabled, setEnabled] = useState<boolean>(INITIAL.enabled);
	const [provider, setProvider] = useState<string>(INITIAL.provider);
	const [model, setModel] = useState<string>(INITIAL.model);
	const [monthlyBudgetUsd, setMonthlyBudgetUsd] = useState<number>(
		INITIAL.monthlyBudgetUsd
	);
	const [persona, setPersona] = useState<string>(INITIAL.persona);
	const [agentEnabled, setAgentEnabled] = useState<boolean>(false);
	const [agentChannelId, setAgentChannelId] = useState<string>("");
	// apiKey: undefined = chưa gõ gì (giữ key cũ); "" sau khi gõ rồi xóa = đặt rỗng.
	const [apiKey, setApiKey] = useState<string>("");

	const overview = useGuildOverview(guildId);
	const channels = overview.data?.channels ?? [];

	const hasKey = settings.data?.hasKey ?? false;
	const keyHint = settings.data?.keyHint ?? "";
	const tokensUsed = settings.data?.tokensUsedThisMonth ?? 0;
	const costUsed = settings.data?.costUsedThisMonth ?? 0;

	const providers = catalog.data ?? {};
	const models = provider ? (providers[provider]?.models ?? []) : [];

	useEffect(() => {
		const data = settings.data;
		if (!data) return;
		setEnabled(data.enabled);
		setProvider(data.provider);
		setModel(data.model);
		setMonthlyBudgetUsd(data.monthlyBudgetUsd);
		setPersona(data.persona);
		setAgentEnabled(data.agentEnabled);
		setAgentChannelId(data.agentChannelId ?? "");
	}, [settings.data]);

	const save = (): void => {
		update.mutate(
			{
				enabled,
				provider,
				model,
				monthlyBudgetUsd,
				persona,
				agentEnabled,
				agentChannelId: agentChannelId || null,
				// Chỉ gửi apiKey khi người dùng đã gõ (khác "") — tránh xóa key vô ý.
				...(apiKey !== "" ? { apiKey } : {}),
			},
			{
				onSuccess: () => {
					setApiKey("");
					toast({ status: "success", title: "Saved" });
				},
			}
		);
	};

	const clearKey = (): void => {
		// Gửi apiKey="" tường minh để xóa key đã lưu trên server.
		update.mutate(
			{
				enabled,
				provider,
				model,
				monthlyBudgetUsd,
				persona,
				agentEnabled,
				agentChannelId: agentChannelId || null,
				apiKey: "",
			},
			{
				onSuccess: () => {
					setApiKey("");
					toast({ status: "success", title: "Đã xóa API key" });
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
						<FormLabel>Provider</FormLabel>
						<Select
							placeholder="Chọn provider…"
							value={provider}
							onChange={(event_: ChangeEvent<HTMLSelectElement>) => {
								setProvider(event_.target.value);
								setModel(""); // đổi provider thì reset model
							}}
						>
							{Object.entries(providers).map(([key, p]) => (
								<option key={key} value={key}>
									{p.label}
								</option>
							))}
						</Select>
					</FormControl>

					<FormControl>
						<FormLabel>Model</FormLabel>
						<Select
							isDisabled={!provider}
							placeholder="Chọn model…"
							value={model}
							onChange={(event_: ChangeEvent<HTMLSelectElement>) => {
								setModel(event_.target.value);
							}}
						>
							{models.map((m) => (
								<option key={m} value={m}>
									{m}
								</option>
							))}
						</Select>
					</FormControl>

					<FormControl>
						<FormLabel>API key (của server bạn)</FormLabel>
						<HStack>
							<Input
								type="password"
								value={apiKey}
								placeholder={
									hasKey ? `••••••••${keyHint}` : "Nhập API key…"
								}
								onChange={(event_: ChangeEvent<HTMLInputElement>) => {
									setApiKey(event_.target.value);
								}}
							/>
							{hasKey ? (
								<Button
									isLoading={update.isPending}
									variant="outline"
									onClick={clearKey}
								>
									Xóa key
								</Button>
							) : null}
						</HStack>
						<Text color="fg.muted" fontSize="xs" mt={1}>
							Để trống = giữ key hiện tại. Key được mã hóa, không bao giờ
							hiển thị lại.
						</Text>
					</FormControl>
				</VStack>
			</Box>

			<Box bg="bg.surface" borderRadius="2xl" boxShadow="sm" p={6}>
				<VStack align="stretch" spacing={4}>
					<FormControl>
						<FormLabel>Ngân sách USD / tháng</FormLabel>
						<NumberInput
							min={0}
							precision={2}
							value={monthlyBudgetUsd}
							onChange={(_, valueNumber: number) => {
								setMonthlyBudgetUsd(
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
						Tháng này: {tokensUsed.toLocaleString()} token ≈ $
						{costUsed.toFixed(4)} / ${monthlyBudgetUsd.toFixed(2)} budget.
					</Text>
				</VStack>
			</Box>

			<Box bg="bg.surface" borderRadius="2xl" boxShadow="sm" p={6}>
				<FormControl>
					<FormLabel>Bot persona (cá tính cho /chat)</FormLabel>
					<Textarea
						placeholder="VD: Bạn là một con mèo máy hài hước, nói trống không…"
						rows={3}
						value={persona}
						onChange={(event_: ChangeEvent<HTMLTextAreaElement>) => {
							setPersona(event_.target.value);
						}}
					/>
				</FormControl>
			</Box>

			<Box bg="bg.surface" borderRadius="2xl" boxShadow="sm" p={6}>
				<VStack align="stretch" spacing={4}>
					<FormControl alignItems="center" display="flex">
						<FormLabel mb={0}>Claw agent (chat @mention + nhớ)</FormLabel>
						<Switch
							isChecked={agentEnabled}
							onChange={(event_: ChangeEvent<HTMLInputElement>) => {
								setAgentEnabled(event_.target.checked);
							}}
						/>
					</FormControl>
					<FormControl>
						<FormLabel>Kênh agent (trống = mọi kênh)</FormLabel>
						<Select
							placeholder="Mọi kênh"
							value={agentChannelId}
							onChange={(event_: ChangeEvent<HTMLSelectElement>) => {
								setAgentChannelId(event_.target.value);
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

			<Divider />

			<Box>
				{enabled && (!provider || !model) ? (
					<Text color="red.400" fontSize="sm" mb={2}>
						Chọn provider và model trước khi lưu (đang bật AI).
					</Text>
				) : null}
				<Button
					colorScheme="purple"
					isDisabled={enabled && (!provider || !model)}
					isLoading={update.isPending}
					onClick={save}
				>
					Save settings
				</Button>
			</Box>
		</VStack>
	);
}
