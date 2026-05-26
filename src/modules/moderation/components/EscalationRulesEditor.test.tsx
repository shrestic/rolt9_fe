import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { EscalationRulesEditor } from "./EscalationRulesEditor";
import type { EscalationRule } from "@/data/models/moderation";

const rules: Array<EscalationRule> = [{ threshold: 3, action: "mute", durationSeconds: 3600 }];

describe("EscalationRulesEditor", () => {
	it("renders existing rules", () => {
		render(<EscalationRulesEditor rules={rules} onChange={() => {}} />);
		expect(screen.getByDisplayValue("3")).toBeInTheDocument();
	});

	it("adds a rule", () => {
		const onChange = vi.fn();
		render(<EscalationRulesEditor rules={rules} onChange={onChange} />);
		fireEvent.click(screen.getByRole("button", { name: /add rule/i }));
		expect(onChange.mock.calls[0]?.[0]).toHaveLength(2);
	});

	it("removes a rule", () => {
		const onChange = vi.fn();
		render(<EscalationRulesEditor rules={rules} onChange={onChange} />);
		fireEvent.click(screen.getByRole("button", { name: /remove rule/i }));
		expect(onChange).toHaveBeenCalledWith([]);
	});
});
