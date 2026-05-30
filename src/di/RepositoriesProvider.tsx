import {
	createContext,
	useContext,
	useMemo,
	type ReactElement,
	type ReactNode,
} from "react";
import { createRepositories } from "./repositories";
import type { Repositories } from "./types";
import type { AiRepository } from "@/data/repositories/ai.repository";
import type { AuthenticationRepository } from "@/data/repositories/authentication.repository";
import type { BadgesRepository } from "@/data/repositories/badges.repository";
import type { CommandRepository } from "@/data/repositories/command.repository";
import type { CurrencyRepository } from "@/data/repositories/currency.repository";
import type { GuildRepository } from "@/data/repositories/guild.repository";
import type { KarmaRepository } from "@/data/repositories/karma.repository";
import type { LevelingRepository } from "@/data/repositories/leveling.repository";
import type { MinigameRepository } from "@/data/repositories/minigame.repository";
import type { ModerationRepository } from "@/data/repositories/moderation.repository";
import type { PetRepository } from "@/data/repositories/pet.repository";
import type { QuestsRepository } from "@/data/repositories/quests.repository";
import type { WelcomeRepository } from "@/data/repositories/welcome.repository";

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
// eslint-disable-next-line react-refresh/only-export-components
export const useModerationRepository = (): ModerationRepository =>
	useRepositories().moderation;
// eslint-disable-next-line react-refresh/only-export-components
export const useCommandRepository = (): CommandRepository =>
	useRepositories().command;
// eslint-disable-next-line react-refresh/only-export-components
export const useLevelingRepository = (): LevelingRepository =>
	useRepositories().leveling;
// eslint-disable-next-line react-refresh/only-export-components
export const useCurrencyRepository = (): CurrencyRepository =>
	useRepositories().currency;
// eslint-disable-next-line react-refresh/only-export-components
export const useBadgeRepository = (): BadgesRepository =>
	useRepositories().badges;
// eslint-disable-next-line react-refresh/only-export-components
export const useQuestsRepository = (): QuestsRepository =>
	useRepositories().quests;
// eslint-disable-next-line react-refresh/only-export-components
export const usePetRepository = (): PetRepository =>
	useRepositories().pet;
// eslint-disable-next-line react-refresh/only-export-components
export const useKarmaRepository = (): KarmaRepository =>
	useRepositories().karma;
// eslint-disable-next-line react-refresh/only-export-components
export const useMinigameRepository = (): MinigameRepository =>
	useRepositories().minigame;
// eslint-disable-next-line react-refresh/only-export-components
export const useAiRepository = (): AiRepository => useRepositories().ai;
// eslint-disable-next-line react-refresh/only-export-components
export const useWelcomeRepository = (): WelcomeRepository =>
	useRepositories().welcome;
