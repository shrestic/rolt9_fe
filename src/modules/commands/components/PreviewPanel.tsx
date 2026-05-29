import {
	Badge,
	Box,
	Code,
	Divider,
	Heading,
	HStack,
	Skeleton,
	Stack,
	Text,
	VStack,
} from "@chakra-ui/react";
import type { ReactElement } from "react";
import { DiscordMarkdown } from "@/components/DiscordMarkdown";
import type { CommandPreview } from "@/data/models/command";

// Convert a resolved color int (e.g. 0x5865F2) back to a CSS hex string for
// rendering the embed's left-side bar. Kept inline since the only consumer
// is this component.
const intToHex = (n: number): string => `#${n.toString(16).padStart(6, "0")}`;

type Props = {
	preview: CommandPreview | undefined;
	isLoading: boolean;
	isError: boolean;
};

// Renders the actual text or embed mockup. Declared above PreviewPanel so the
// JSX below has it in scope (no-use-before-define).
const RenderedSection = ({
	preview,
}: {
	preview: CommandPreview;
}): ReactElement => {
	if (preview.renderedText) {
		// Render Discord markdown so **bold** / *italic* / [link] etc. appear
		// the same way they will in the actual Discord message.
		return (
			<Box bg="bg.surface" borderRadius="md" borderWidth="1px" fontSize="sm" p={3}>
				<Box whiteSpace="pre-wrap">
					<DiscordMarkdown text={preview.renderedText} />
				</Box>
			</Box>
		);
	}
	if (preview.renderedEmbed) {
		const embed = preview.renderedEmbed;
		return (
			<Box
				bg="bg.surface"
				borderLeftColor={intToHex(embed.color)}
				borderLeftWidth="4px"
				borderRadius="md"
				borderWidth="1px"
				p={3}
			>
				{/* Embed title is plain text in Discord — no markdown rendering. */}
				{embed.title ? (
					<Heading mb={1} size="sm">
						{embed.title}
					</Heading>
				) : null}
				{embed.description ? (
					<Box fontSize="sm" whiteSpace="pre-wrap">
						<DiscordMarkdown text={embed.description} />
					</Box>
				) : null}
				{embed.imageUrl ? (
					<Box mt={2}>
						<img alt="" src={embed.imageUrl} style={{ maxWidth: "100%" }} />
					</Box>
				) : null}
				{embed.footer ? (
					<Text color="text.subtle" fontSize="xs" mt={2}>
						{embed.footer}
					</Text>
				) : null}
			</Box>
		);
	}
	return (
		<Text color="text.subtle" fontSize="sm">
			(no output for this draft)
		</Text>
	);
};

// Right-hand panel of the command form. Two sections:
//   1. Rendered output  — what the message will look like in Discord, with
//      placeholders substituted using the live guild context.
//   2. Available placeholders — every {token} the bot understands, with the
//      sample value used in this render. Mirrors what the BE registry says,
//      so adding a placeholder server-side automatically shows up here.
export const PreviewPanel = ({
	preview,
	isLoading,
	isError,
}: Props): ReactElement => {
	return (
		<VStack
			align="stretch"
			bg="bg.muted"
			borderRadius="lg"
			borderWidth="1px"
			h="100%"
			p={4}
			spacing={5}
		>
			<Heading color="text.subtle" size="xs" textTransform="uppercase">
				Live preview
			</Heading>

			{isLoading ? (
				<Stack>
					<Skeleton height="20px" />
					<Skeleton height="20px" />
				</Stack>
			) : isError ? (
				<Text color="text.danger" fontSize="sm">
					Preview failed — check that the bot is in this server.
				</Text>
			) : !preview ? (
				<Text color="text.subtle" fontSize="sm">
					Start typing to see the rendered output.
				</Text>
			) : (
				<RenderedSection preview={preview} />
			)}

			<Divider />

			<VStack align="stretch" spacing={2}>
				<Heading color="text.subtle" size="xs" textTransform="uppercase">
					Available placeholders
				</Heading>
				{preview ? (
					<VStack align="stretch" spacing={1}>
						{preview.placeholders.map((p) => (
							<HStack key={p.name} fontSize="sm">
								<Code fontSize="xs" minW="120px">
									{`{${p.name}}`}
								</Code>
								<Text color="text.muted" flex="1">
									{p.description}
								</Text>
								<Badge
									isTruncated
									colorScheme="purple"
									fontSize="xs"
									maxW="160px"
								>
									{p.example}
								</Badge>
							</HStack>
						))}
					</VStack>
				) : (
					<Text color="text.subtle" fontSize="sm">
						(loading…)
					</Text>
				)}
			</VStack>
		</VStack>
	);
};
