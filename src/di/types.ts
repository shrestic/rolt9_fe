import type { AuthenticationRepository } from "@/data/repositories/authentication.repository";
import type { CommandRepository } from "@/data/repositories/command.repository";
import type { GuildRepository } from "@/data/repositories/guild.repository";
import type { ModerationRepository } from "@/data/repositories/moderation.repository";

export type Repositories = {
	auth: AuthenticationRepository;
	guild: GuildRepository;
	moderation: ModerationRepository;
	command: CommandRepository;
};
