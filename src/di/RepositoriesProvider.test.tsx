import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import {
	RepositoriesProvider,
	useGuildRepository,
} from "./RepositoriesProvider";
import type { Repositories } from "./types";

const Probe = (): React.ReactElement => {
	const repo = useGuildRepository();
	return <div>{typeof repo.getMyGuilds}</div>;
};

describe("RepositoriesProvider", () => {
	it("provides the injected repositories to consumers", () => {
		const fake = {
			auth: {},
			guild: {
				// eslint-disable-next-line @typescript-eslint/require-await
				getMyGuilds: async () => [],
				// eslint-disable-next-line @typescript-eslint/require-await
				getOverview: async () => ({}),
			},
		} as unknown as Repositories;
		render(
			<RepositoriesProvider value={fake}>
				<Probe />
			</RepositoriesProvider>
		);
		expect(screen.getByText("function")).toBeInTheDocument();
	});
});
