import axios from "axios";
import type { GuildRemoteDataSource } from "@/data/datasource/remote/guild.remote";
import {
	toGuildSummaries,
	toGuildOverview,
	type GuildSummary,
	type GuildOverview,
} from "@/data/models/guild";
import { ForbiddenException } from "@/data/exception/guild.exception";

export type GuildRepository = {
	getMyGuilds: () => Promise<Array<GuildSummary>>;
	getOverview: (id: string) => Promise<GuildOverview>;
};

export const makeGuildRepository = (
	remote: GuildRemoteDataSource
): GuildRepository => ({
	// A 401 from /me/guilds is handled globally by the HTTP response interceptor,
	// which redirects to `/`. This method therefore only needs to surface mapped
	// data. By contrast, getOverview also translates a 403 → ForbiddenException
	// because non-manager guild members may attempt to access a guild they can see
	// but cannot administer.
	getMyGuilds: async (): Promise<Array<GuildSummary>> =>
		toGuildSummaries(await remote.getMyGuilds()),
	getOverview: async (id): Promise<GuildOverview> => {
		try {
			return toGuildOverview(await remote.getOverview(id));
		} catch (error) {
			if (axios.isAxiosError(error) && error.response?.status === 403) {
				throw new ForbiddenException(error);
			}
			throw error;
		}
	},
});
