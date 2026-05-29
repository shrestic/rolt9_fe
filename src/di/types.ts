import type { AuthenticationRepository } from "@/data/repositories/authentication.repository";
import type { BadgesRepository } from "@/data/repositories/badges.repository";
import type { CommandRepository } from "@/data/repositories/command.repository";
import type { CurrencyRepository } from "@/data/repositories/currency.repository";
import type { GuildRepository } from "@/data/repositories/guild.repository";
import type { LevelingRepository } from "@/data/repositories/leveling.repository";
import type { ModerationRepository } from "@/data/repositories/moderation.repository";

export type Repositories = {
	auth: AuthenticationRepository;
	guild: GuildRepository;
	moderation: ModerationRepository;
	command: CommandRepository;
	leveling: LevelingRepository;
	currency: CurrencyRepository;
	badges: BadgesRepository;
};
