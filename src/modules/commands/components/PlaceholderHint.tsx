import { Box, HStack, Tag, Text, useToast } from "@chakra-ui/react";
import type { ReactElement } from "react";
import type { PlaceholderInfo } from "@/data/models/command";

type Props = {
	placeholders: Array<PlaceholderInfo>;
};

// Inline help showing every {token} the bot understands. Sits right below the
// Response text / Embed description fields so admins discover what placeholders
// they can drop in without hunting through docs or scrolling to the preview panel.
//
// Each chip shows the token + its sample substituted value, e.g.
//   {user} → alice
// so admins see at a glance what each one expands to without needing to hover.
// Click a chip → copies `{token}` to the clipboard so the admin can paste into
// the textarea.
export const PlaceholderHint = ({
	placeholders,
}: Props): ReactElement | null => {
	const toast = useToast();
	if (placeholders.length === 0) return null;

	const copy = async (token: string): Promise<void> => {
		try {
			await navigator.clipboard.writeText(token);
			toast({ status: "success", title: `Copied ${token}`, duration: 1500 });
		} catch {
			// Older browsers / non-https contexts may not have clipboard access.
			// Silently fall back — the chip text still teaches the user what tokens
			// exist; they can type it manually.
		}
	};

	return (
		<Box mt={2}>
			<Text color="text.subtle" fontSize="xs" mb={1}>
				Click a placeholder to copy it. Sample values come from this server:
			</Text>
			<HStack flexWrap="wrap" spacing={2}>
				{placeholders.map((p) => {
					const token = `{${p.name}}`;
					return (
						<Tag
							key={p.name}
							as="button"
							colorScheme="purple"
							cursor="pointer"
							size="sm"
							type="button"
							onClick={() => {
								void copy(token);
							}}
						>
							{token}{" "}
							<Text
								as="span"
								color="accent.primaryActive"
								fontWeight="normal"
								ml={1}
								opacity={0.75}
							>
								→ {p.example}
							</Text>
						</Tag>
					);
				})}
			</HStack>
		</Box>
	);
};
