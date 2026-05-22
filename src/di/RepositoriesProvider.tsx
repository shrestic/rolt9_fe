import {
	createContext,
	useContext,
	useMemo,
	type ReactElement,
	type ReactNode,
} from "react";
import { createRepositories } from "./repositories";
import type { Repositories } from "./types";
import type { AuthenticationRepository } from "@/data/repositories/authentication.repository";
import type { GuildRepository } from "@/data/repositories/guild.repository";

const RepositoriesContext = createContext<Repositories | null>(null);

export const RepositoriesProvider = ({
	children,
	value,
}: {
	children: ReactNode;
	value?: Repositories;
}): ReactElement => {
	const repositories = useMemo(() => value ?? createRepositories(), [value]);
	return (
		<RepositoriesContext.Provider value={repositories}>
			{children}
		</RepositoriesContext.Provider>
	);
};

// eslint-disable-next-line react-refresh/only-export-components
export const useRepositories = (): Repositories => {
	const context = useContext(RepositoriesContext);
	if (!context) {
		throw new Error("useRepositories must be used within RepositoriesProvider");
	}
	return context;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuthRepository = (): AuthenticationRepository =>
	useRepositories().auth;
// eslint-disable-next-line react-refresh/only-export-components
export const useGuildRepository = (): GuildRepository =>
	useRepositories().guild;
