import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DiscordMarkdown } from "./DiscordMarkdown";

describe("DiscordMarkdown", () => {
	it("renders **bold**", () => {
		render(<DiscordMarkdown text="hello **world**" />);
		const bold = screen.getByText("world");
		expect(bold.tagName).toBe("STRONG");
	});

	it("renders *italic*", () => {
		render(<DiscordMarkdown text="say *hi*" />);
		expect(screen.getByText("hi").tagName).toBe("EM");
	});

	it("renders ~~strike~~", () => {
		render(<DiscordMarkdown text="~~gone~~" />);
		expect(screen.getByText("gone").tagName).toBe("S");
	});

	it("renders `code`", () => {
		render(<DiscordMarkdown text="run `pnpm dev`" />);
		expect(screen.getByText("pnpm dev").tagName).toBe("CODE");
	});

	it("renders [link](url)", () => {
		render(<DiscordMarkdown text="see [docs](https://example.com)" />);
		const link = screen.getByText("docs");
		expect(link.tagName).toBe("A");
		expect(link.getAttribute("href")).toBe("https://example.com");
	});

	it("preserves newlines as line breaks", () => {
		const { container } = render(<DiscordMarkdown text={"line1\nline2"} />);
		// Two text lines separated by a <br>.
		expect(container.querySelectorAll("br").length).toBe(1);
		expect(container.textContent).toContain("line1");
		expect(container.textContent).toContain("line2");
	});

	it("handles multiple markdown spans in one line", () => {
		render(<DiscordMarkdown text="**bold** and *italic* together" />);
		expect(screen.getByText("bold").tagName).toBe("STRONG");
		expect(screen.getByText("italic").tagName).toBe("EM");
	});

	it("leaves plain text untouched", () => {
		render(<DiscordMarkdown text="just plain words" />);
		expect(screen.getByText("just plain words")).toBeInTheDocument();
	});
});
