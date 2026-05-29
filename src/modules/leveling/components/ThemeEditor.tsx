import {
	Box,
	Button,
	FormControl,
	FormLabel,
	Input,
	Select,
	SimpleGrid,
	useToast,
	VStack,
} from "@chakra-ui/react";
import {
	useEffect,
	useState,
	type ChangeEvent,
	type ReactElement,
} from "react";
import type { RankCardTheme } from "@/data/models/leveling";
import { RankCardPreview } from "@/modules/leveling/components/RankCardPreview";
import {
	useRankCardTheme,
	useUpdateRankCardTheme,
} from "@/modules/leveling/hooks/useTheme";

type Props = {
	guildId: string;
};

type BgType = RankCardTheme["bgType"];

// Defaults used until the GET resolves; effect below overwrites them.
const INITIAL: RankCardTheme = {
	bgType: "solid",
	bgColor1: "#1f1f24",
	bgColor2: "#4a4a55",
	accentColor: "#7c5cff",
	textColor: "#ffffff",
	bgImageUrl: null,
};

export function ThemeEditor({ guildId }: Props): ReactElement {
	const theme = useRankCardTheme(guildId);
	const update = useUpdateRankCardTheme(guildId);
	const toast = useToast();

	const [bgType, setBgType] = useState<BgType>(INITIAL.bgType);
	const [bgColor1, setBgColor1] = useState<string>(INITIAL.bgColor1);
	const [bgColor2, setBgColor2] = useState<string>(INITIAL.bgColor2);
	const [accentColor, setAccentColor] = useState<string>(INITIAL.accentColor);
	const [textColor, setTextColor] = useState<string>(INITIAL.textColor);

	// Sync server state once it loads; mirrors LevelingSettingsForm.
	useEffect(() => {
		const data = theme.data;
		if (!data) return;
		// Image backgrounds are no longer editable — fall back to solid.
		setBgType(data.bgType === "image" ? "solid" : data.bgType);
		setBgColor1(data.bgColor1);
		setBgColor2(data.bgColor2);
		setAccentColor(data.accentColor);
		setTextColor(data.textColor);
	}, [theme.data]);

	// Live preview consumes the same shape as RankCardTheme.
	const previewTheme: RankCardTheme = {
		bgType,
		bgColor1,
		bgColor2,
		accentColor,
		textColor,
		bgImageUrl: null,
	};

	const save = (): void => {
		update.mutate(
			{
				bgType,
				bgColor1,
				bgColor2,
				accentColor,
				textColor,
				bgImageUrl: null,
			},
			{
				onSuccess: () => {
					toast({ status: "success", title: "Saved" });
				},
			}
		);
	};

	return (
		<SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
			<Box bg="bg.surface" borderRadius="2xl" boxShadow="sm" p={6}>
				<VStack align="stretch" spacing={4}>
					<FormControl>
						<FormLabel>Background type</FormLabel>
						<Select
							value={bgType}
							onChange={(event_: ChangeEvent<HTMLSelectElement>) => {
								setBgType(event_.target.value as BgType);
							}}
						>
							<option value="solid">Solid color</option>
							<option value="gradient">Gradient</option>
						</Select>
					</FormControl>

					<FormControl>
						<FormLabel>Background color 1</FormLabel>
						<Input
							p={1}
							type="color"
							value={bgColor1}
							onChange={(event_: ChangeEvent<HTMLInputElement>) => {
								setBgColor1(event_.target.value);
							}}
						/>
					</FormControl>

					<FormControl isDisabled={bgType !== "gradient"}>
						<FormLabel>Background color 2 (gradient only)</FormLabel>
						<Input
							p={1}
							type="color"
							value={bgColor2}
							onChange={(event_: ChangeEvent<HTMLInputElement>) => {
								setBgColor2(event_.target.value);
							}}
						/>
					</FormControl>

					<FormControl>
						<FormLabel>Accent color</FormLabel>
						<Input
							p={1}
							type="color"
							value={accentColor}
							onChange={(event_: ChangeEvent<HTMLInputElement>) => {
								setAccentColor(event_.target.value);
							}}
						/>
					</FormControl>

					<FormControl>
						<FormLabel>Text color</FormLabel>
						<Input
							p={1}
							type="color"
							value={textColor}
							onChange={(event_: ChangeEvent<HTMLInputElement>) => {
								setTextColor(event_.target.value);
							}}
						/>
					</FormControl>

					<Box>
						<Button
							colorScheme="purple"
							isLoading={update.isPending}
							onClick={save}
						>
							Save theme
						</Button>
					</Box>
				</VStack>
			</Box>

			<Box bg="bg.surface" borderRadius="2xl" boxShadow="sm" p={6}>
				<VStack align="stretch" spacing={3}>
					<FormLabel mb={0}>Live preview</FormLabel>
					<RankCardPreview theme={previewTheme} />
				</VStack>
			</Box>
		</SimpleGrid>
	);
}
