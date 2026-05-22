export const endpoints = {
	me: () => "/me",
	meGuilds: () => "/me/guilds",
	guildOverview: (id: string) => `/guilds/${id}/overview`,
	authLogout: () => "/auth/logout",
	discordLogin: () => "/auth/discord/login",
} as const;
