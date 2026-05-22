import { http } from "@/utils/http";
import { makeAuthenticationRemote } from "@/data/datasource/remote/authentication.remote";
import { makeGuildRemote } from "@/data/datasource/remote/guild.remote";
import { makeAuthenticationRepository } from "@/data/repositories/authentication.repository";
import { makeGuildRepository } from "@/data/repositories/guild.repository";
import type { Repositories } from "./types";

export const createRepositories = (client = http): Repositories => {
	const authRemote = makeAuthenticationRemote(client);
	const guildRemote = makeGuildRemote(client);
	return {
		auth: makeAuthenticationRepository(authRemote),
		guild: makeGuildRepository(guildRemote),
	};
};
