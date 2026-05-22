import { http } from "@/utils/http";
import { endpoints } from "@/settings/endpoints";

export type GuildRemoteDataSource = {
	getMyGuilds: () => Promise<unknown>;
	getOverview: (id: string) => Promise<unknown>;
};

export const makeGuildRemote = (client = http): GuildRemoteDataSource => ({
	getMyGuilds: async (): Promise<unknown> =>
		(await client.get(endpoints.meGuilds())).data as unknown,
	getOverview: async (id): Promise<unknown> =>
		(await client.get(endpoints.guildOverview(id))).data as unknown,
});
