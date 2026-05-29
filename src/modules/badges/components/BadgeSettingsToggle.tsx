import {
	Box,
	FormControl,
	FormLabel,
	Switch,
	useToast,
} from "@chakra-ui/react";
import type { ChangeEvent, ReactElement } from "react";
import {
	useBadgeSettings,
	useUpdateBadgeSettings,
} from "@/modules/badges/hooks/useBadgeSettings";

type Props = {
	guildId: string;
};

// Renders a single toggle card for the badges master-switch. Mirrors the
// "Enable currency" box in CurrencySettingsForm — same card shell, same
// fire-and-forget save-on-change pattern so the UX is consistent.
export function BadgeSettingsToggle({ guildId }: Props): ReactElement {
	const settings = useBadgeSettings(guildId);
	const update = useUpdateBadgeSettings(guildId);
	const toast = useToast();

	// Read the enabled flag from server state; fall back to false while loading
	// so the switch starts unchecked rather than undefined.
	const enabled = settings.data?.enabled ?? false;

	const handleChange = (event_: ChangeEvent<HTMLInputElement>): void => {
		// Immediately persist the new value — there are no other fields to batch.
		update.mutate(
			{ enabled: event_.target.checked },
			{
				onSuccess: () => {
					toast({ status: "success", title: "Saved" });
				},
			}
		);
	};

	return (
		<Box bg="bg.surface" borderRadius="2xl" boxShadow="sm" p={6}>
			<FormControl alignItems="center" display="flex">
				<FormLabel mb={0}>Enable badges</FormLabel>
				<Switch
					isChecked={enabled}
					isDisabled={settings.isLoading || update.isPending}
					onChange={handleChange}
				/>
			</FormControl>
		</Box>
	);
}
