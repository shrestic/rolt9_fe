import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CaseTable } from "./CaseTable";
import type { ModerationCase } from "@/data/models/moderation";

const cases: Array<ModerationCase> = [
	{
		caseNumber: 1, action: "warn", source: "manual", targetUserId: "7",
		targetUsername: "bad", moderatorUserId: "8", moderatorUsername: "mod",
		reason: "spam", durationSeconds: null, createdAt: "2026-01-01T00:00:00Z", active: true,
	},
];

describe("CaseTable", () => {
	it("renders a row per case", () => {
		render(<CaseTable cases={cases} onDeactivate={() => {}} />);
		expect(screen.getByText("bad")).toBeInTheDocument();
		expect(screen.getByText("warn")).toBeInTheDocument();
	});

	it("shows an empty state", () => {
		render(<CaseTable cases={[]} onDeactivate={() => {}} />);
		expect(screen.getByText(/no cases/i)).toBeInTheDocument();
	});

	it("labels the action 'Unban' on a ban case and 'Remove' otherwise", () => {
		const warnCase: ModerationCase = {
			caseNumber: 1, action: "warn", source: "manual", targetUserId: "7",
			targetUsername: "bad", moderatorUserId: "8", moderatorUsername: "mod",
			reason: "spam", durationSeconds: null, createdAt: "2026-01-01T00:00:00Z", active: true,
		};
		const banCase: ModerationCase = { ...warnCase, caseNumber: 2, action: "ban" };
		render(<CaseTable cases={[warnCase, banCase]} onDeactivate={() => {}} />);
		expect(screen.getByRole("button", { name: "Unban" })).toBeInTheDocument();
		expect(screen.getByRole("button", { name: "Remove" })).toBeInTheDocument();
	});
});
