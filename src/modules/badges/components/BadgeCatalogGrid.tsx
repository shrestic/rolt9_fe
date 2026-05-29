import {
	Box,
	Heading,
	SimpleGrid,
	Spinner,
	Text,
	VStack,
} from "@chakra-ui/react";
import type { ReactElement } from "react";
import { useBadgeCatalog } from "@/modules/badges/hooks/useBadgeCatalog";
import type { BadgeCatalogEntry } from "@/data/models/badges";

type Props = {
	guildId: string;
};

// Human-readable label for each stat group heading. The keys are snake_case
// because they come from the wire (the backend defines stat names like
// "longest_streak"). The eslint camelcase rule is suppressed here because these
// are intentional wire-level identifiers used only as object keys.
const STAT_LABELS: Record<string, string> = {
	level: "Level",
	// eslint-disable-next-line camelcase
	longest_streak: "Longest Streak",
	balance: "Balance",
};

// Groups the flat catalog array by the `stat` field so we can render a
// section heading per group, e.g. "Level", "Longest Streak", "Balance".
function groupByStat(
	entries: Array<BadgeCatalogEntry>
): Map<string, Array<BadgeCatalogEntry>> {
	const map = new Map<string, Array<BadgeCatalogEntry>>();
	for (const entry of entries) {
		if (!map.has(entry.stat)) map.set(entry.stat, []);
		map.get(entry.stat)!.push(entry);
	}
	return map;
}

// A single badge card — read-only display of emoji, name, and description.
function BadgeCard({ entry }: { entry: BadgeCatalogEntry }): ReactElement {
	return (
		<Box
			bg="bg.surface"
			borderRadius="xl"
			boxShadow="sm"
			p={4}
		>
			<VStack align="start" spacing={1}>
				{/* Emoji + name on the same line for quick scanning. */}
				<Text fontSize="sm" fontWeight="semibold">
					{entry.emoji} {entry.name}
				</Text>
				<Text color="text.muted" fontSize="xs">
					{entry.description}
				</Text>
				{/* Threshold hint so admins can see the unlock value at a glance. */}
				<Text color="text.muted" fontSize="xs">
					Threshold: {entry.threshold.toLocaleString()}
				</Text>
			</VStack>
		</Box>
	);
}

// Renders all catalog entries grouped by stat with a heading per group.
// Falls back to a spinner while loading and a short message if the catalog
// is empty (shouldn't happen in practice, but guards the UI).
export function BadgeCatalogGrid({ guildId }: Props): ReactElement {
	const { data, isLoading } = useBadgeCatalog(guildId);

	if (isLoading) {
		return (
			<Box py={8} textAlign="center">
				<Spinner />
			</Box>
		);
	}

	if (!data || data.length === 0) {
		return (
			<Text color="text.muted" fontSize="sm">
				No badges configured for this server.
			</Text>
		);
	}

	const groups = groupByStat(data);

	return (
		<VStack align="stretch" spacing={8}>
			{[...groups.entries()].map(([stat, entries]) => (
				<VStack key={stat} align="stretch" spacing={3}>
					{/* Group heading uses the friendly label, falls back to raw key. */}
					<Heading size="sm">
						{STAT_LABELS[stat] ?? stat}
					</Heading>
					<SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
						{entries.map((entry) => (
							<BadgeCard key={entry.key} entry={entry} />
						))}
					</SimpleGrid>
				</VStack>
			))}
		</VStack>
	);
}
