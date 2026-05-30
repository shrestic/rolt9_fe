import { http } from "@/utils/http";
import { makeAiRemote } from "@/data/datasource/remote/ai.remote";
import { makeAuthenticationRemote } from "@/data/datasource/remote/authentication.remote";
import { makeBadgesRemote } from "@/data/datasource/remote/badges.remote";
import { makeCommandRemote } from "@/data/datasource/remote/command.remote";
import { makeCurrencyRemote } from "@/data/datasource/remote/currency.remote";
import { makeGuildRemote } from "@/data/datasource/remote/guild.remote";
import { makeKarmaRemote } from "@/data/datasource/remote/karma.remote";
import { makeLevelingRemote } from "@/data/datasource/remote/leveling.remote";
import { makeMinigameRemote } from "@/data/datasource/remote/minigame.remote";
import { makeModerationRemote } from "@/data/datasource/remote/moderation.remote";
import { makePetRemote } from "@/data/datasource/remote/pet.remote";
import { makeQuestsRemote } from "@/data/datasource/remote/quests.remote";
import { makeAiRepository } from "@/data/repositories/ai.repository";
import { makeAuthenticationRepository } from "@/data/repositories/authentication.repository";
import { makeBadgesRepository } from "@/data/repositories/badges.repository";
import { makeCommandRepository } from "@/data/repositories/command.repository";
import { makeCurrencyRepository } from "@/data/repositories/currency.repository";
import { makeGuildRepository } from "@/data/repositories/guild.repository";
import { makeKarmaRepository } from "@/data/repositories/karma.repository";
import { makeLevelingRepository } from "@/data/repositories/leveling.repository";
import { makeMinigameRepository } from "@/data/repositories/minigame.repository";
import { makeModerationRepository } from "@/data/repositories/moderation.repository";
import { makePetRepository } from "@/data/repositories/pet.repository";
import { makeQuestsRepository } from "@/data/repositories/quests.repository";
import type { Repositories } from "./types";

export const createRepositories = (client = http): Repositories => {
	const authRemote = makeAuthenticationRemote(client);
	const guildRemote = makeGuildRemote(client);
	const moderationRemote = makeModerationRemote(client);
	const commandRemote = makeCommandRemote(client);
	const levelingRemote = makeLevelingRemote(client);
	const currencyRemote = makeCurrencyRemote(client);
	const badgesRemote = makeBadgesRemote(client);
	const questsRemote = makeQuestsRemote(client);
	const petRemote = makePetRemote(client);
	const karmaRemote = makeKarmaRemote(client);
	const minigameRemote = makeMinigameRemote(client);
	const aiRemote = makeAiRemote(client);
	return {
		auth: makeAuthenticationRepository(authRemote),
		guild: makeGuildRepository(guildRemote),
		moderation: makeModerationRepository(moderationRemote),
		command: makeCommandRepository(commandRemote),
		leveling: makeLevelingRepository(levelingRemote),
		currency: makeCurrencyRepository(currencyRemote),
		badges: makeBadgesRepository(badgesRemote),
		quests: makeQuestsRepository(questsRemote),
		pet: makePetRepository(petRemote),
		karma: makeKarmaRepository(karmaRemote),
		minigame: makeMinigameRepository(minigameRemote),
		ai: makeAiRepository(aiRemote),
	};
};
