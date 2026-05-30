import { FormControl, FormLabel, Switch } from "@chakra-ui/react";
import type { ChangeEvent, ReactElement } from "react";
import {
	useKarmaSettings,
	useUpdateKarmaSettings,
} from "@/modules/karma/hooks/useKarma";

type Props = {
	guildId: string;
};

// A single toggle that reads the current `enabled` state from the API and
// immediately persists any change. The mutation response updates the query
// cache so the UI stays in sync without a second round-trip.
export function KarmaSettingsToggle({ guildId }: Props): ReactElement {
	const settings = useKarmaSettings(guildId);
	const update = useUpdateKarmaSettings(guildId);

	// Use the server value when available; fall back to false while loading.
	const enabled = settings.data?.enabled ?? false;

	const handleChange = (event_: ChangeEvent<HTMLInputElement>): void => {
		update.mutate({ enabled: event_.target.checked });
	};

	return (
		<FormControl alignItems="center" display="flex">
			<FormLabel mb={0}>Enable karma</FormLabel>
			<Switch
				isChecked={enabled}
				isDisabled={settings.isLoading || update.isPending}
				onChange={handleChange}
			/>
		</FormControl>
	);
}
