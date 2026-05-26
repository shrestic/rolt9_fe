export const endpoints = {
	me: () => "/me",
	meGuilds: () => "/me/guilds",
	guildOverview: (id: string) => `/guilds/${id}/overview`,
	authLogout: () => "/auth/logout",
	discordLogin: () => "/auth/discord/login",
	moderationSettings: (id: string) => `/guilds/${id}/moderation`,
	cases: (id: string) => `/guilds/${id}/cases`,
	case: (id: string, n: number) => `/guilds/${id}/cases/${n}`,
	commands: (id: string) => `/guilds/${id}/commands`,
	command: (id: string, commandId: string) =>
		`/guilds/${id}/commands/${commandId}`,
	commandSettings: (id: string) => `/guilds/${id}/command-settings`,
	commandPreview: (id: string) => `/guilds/${id}/commands/preview`,
} as const;
