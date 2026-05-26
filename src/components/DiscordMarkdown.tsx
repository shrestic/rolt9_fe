import type { ReactElement, ReactNode } from "react";

// Minimal Discord-flavored Markdown renderer for the preview pane. Discord
// supports a small subset of Markdown for embeds and messages:
//   **bold**   *italic*   __underline__   ~~strike~~   `code`
//   [text](url)
//   newlines = line breaks (no paragraph reflow)
//
// We deliberately don't pull in react-markdown / remark — Discord's grammar is
// small enough that a regex-based pass beats a 30 KB dependency. Nesting is
// rare in real embeds (Discord itself doesn't nest most styles correctly), so
// this single-pass tokenizer is good enough for previews.

// Each pattern captures the whole match in group 1 and the inner content in
// group 2 (or the URL pair for links). Order matters — longer markers first
// so `**` beats `*`, and we resolve links before catching their `[text]`.
const PATTERNS: Array<{
	regex: RegExp;
	render: (match: RegExpExecArray, key: string) => ReactElement;
}> = [
	{
		regex: /\*\*([^*\n]+?)\*\*/,
		render: (m, key) => <strong key={key}>{m[1]}</strong>,
	},
	{
		regex: /__([^_\n]+?)__/,
		render: (m, key) => (
			<span key={key} style={{ textDecoration: "underline" }}>
				{m[1]}
			</span>
		),
	},
	{
		regex: /\*([^*\n]+?)\*/,
		render: (m, key) => <em key={key}>{m[1]}</em>,
	},
	{
		regex: /~~([^~\n]+?)~~/,
		render: (m, key) => <s key={key}>{m[1]}</s>,
	},
	{
		regex: /`([^`\n]+?)`/,
		render: (m, key) => (
			<code
				key={key}
				style={{
					background: "rgba(0,0,0,0.06)",
					padding: "0 4px",
					borderRadius: "3px",
					fontSize: "0.9em",
				}}
			>
				{m[1]}
			</code>
		),
	},
	{
		regex: /\[([^\]\n]+?)\]\(([^)\n]+?)\)/,
		render: (m, key) => (
			<a
				key={key}
				href={m[2]}
				rel="noreferrer"
				style={{ color: "#00a8fc", textDecoration: "none" }}
				target="_blank"
			>
				{m[1]}
			</a>
		),
	},
];

// Walks `text` once, peeling off the earliest matching pattern at each step.
// Anything between matches is returned as plain text. We re-search from the
// remainder rather than tracking offsets manually because the regexes are
// non-global and stay simple.
const renderInline = (text: string, prefix: string): Array<ReactNode> => {
	const nodes: Array<ReactNode> = [];
	let remaining = text;
	let counter = 0;

	while (remaining.length > 0) {
		let earliest: {
			index: number;
			match: RegExpExecArray;
			render: (m: RegExpExecArray, key: string) => ReactElement;
		} | null = null;

		for (const { regex, render } of PATTERNS) {
			const m = regex.exec(remaining);
			if (m && (earliest === null || m.index < earliest.index)) {
				earliest = { index: m.index, match: m, render };
			}
		}

		if (!earliest) {
			nodes.push(remaining);
			break;
		}

		if (earliest.index > 0) {
			nodes.push(remaining.slice(0, earliest.index));
		}
		nodes.push(earliest.render(earliest.match, `${prefix}-${counter++}`));
		remaining = remaining.slice(earliest.index + earliest.match[0].length);
	}

	return nodes;
};

type Props = {
	text: string;
};

// Renders Discord-style Markdown as React nodes. Preserves newlines as <br>.
export const DiscordMarkdown = ({ text }: Props): ReactElement => {
	const lines = text.split("\n");
	return (
		<>
			{lines.map((line, lineIndex) => (
				<span key={lineIndex}>
					{renderInline(line, `l${lineIndex}`)}
					{lineIndex < lines.length - 1 && <br />}
				</span>
			))}
		</>
	);
};
