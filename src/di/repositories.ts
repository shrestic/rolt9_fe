import { http } from "@/utils/http";
import { makeAuthenticationRemote } from "@/data/datasource/remote/authentication.remote";
import { makeBadgesRemote } from "@/data/datasource/remote/badges.remote";
import { makeCommandRemote } from "@/data/datasource/remote/command.remote";
import { makeCurrencyRemote } from "@/data/datasource/remote/currency.remote";
import { makeGuildRemote } from "@/data/datasource/remote/guild.remote";
import { makeLevelingRemote } from "@/data/datasource/remote/leveling.remote";
import { makeModerationRemote } from "@/data/datasource/remote/moderation.remote";
import { makeQuestsRemote } from "@/data/datasource/remote/quests.remote";
import { makeAuthenticationRepository } from "@/data/repositories/authentication.repository";
import { makeBadgesRepository } from "@/data/repositories/badges.repository";
import { makeCommandRepository } from "@/data/repositories/command.repository";
import { makeCurrencyRepository } from "@/data/repositories/currency.repository";
import { makeGuildRepository } from "@/data/repositories/guild.repository";
import { makeLevelingRepository } from "@/data/repositories/leveling.repository";
import { makeModerationRepository } from "@/data/repositories/moderation.repository";
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
	return {
		auth: makeAuthenticationRepository(authRemote),
		guild: makeGuildRepository(guildRemote),
		moderation: makeModerationRepository(moderationRemote),
		command: makeCommandRepository(commandRemote),
		leveling: makeLevelingRepository(levelingRemote),
		currency: makeCurrencyRepository(currencyRemote),
		badges: makeBadgesRepository(badgesRemote),
		quests: makeQuestsRepository(questsRemote),
	};
};
