import type { AuthenticationRepository } from "@/data/repositories/authentication.repository";
import type { GuildRepository } from "@/data/repositories/guild.repository";

export type Repositories = {
	auth: AuthenticationRepository;
	guild: GuildRepository;
};
