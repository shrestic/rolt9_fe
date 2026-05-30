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
	levelingSettings: (id: string) => `/guilds/${id}/leveling/settings`,
	levelingLeaderboard: (id: string) => `/guilds/${id}/leveling/leaderboard`,
	levelingMember: (id: string, userId: string) =>
		`/guilds/${id}/leveling/members/${userId}`,
	levelingRewards: (id: string) => `/guilds/${id}/leveling/rewards`,
	levelingReward: (id: string, level: number) =>
		`/guilds/${id}/leveling/rewards/${level}`,
	levelingTheme: (id: string) => `/guilds/${id}/leveling/rank-card-theme`,
	currencySettings: (id: string) => `/guilds/${id}/currency/settings`,
	currencyLeaderboard: (id: string) => `/guilds/${id}/currency/leaderboard`,
	currencyMember: (id: string, userId: string) =>
		`/guilds/${id}/currency/members/${userId}`,
	badgeSettings: (id: string) => `/guilds/${id}/badges/settings`,
	badgeCatalog: (id: string) => `/guilds/${id}/badges/catalog`,
	quests: (guildId: string) => `/guilds/${guildId}/quests`,
	quest: (guildId: string, questId: string) =>
		`/guilds/${guildId}/quests/${questId}`,
	petSettings: (guildId: string) => `/guilds/${guildId}/pet/settings`,
	petStatus: (guildId: string) => `/guilds/${guildId}/pet/status`,
	karmaSettings: (guildId: string) => `/guilds/${guildId}/karma/settings`,
	karmaLeaderboard: (guildId: string) =>
		`/guilds/${guildId}/karma/leaderboard`,
	minigameSettings: (guildId: string) => `/guilds/${guildId}/minigame/settings`,
	aiSettings: (guildId: string) => `/guilds/${guildId}/ai/settings`,
	aiKb: (guildId: string) => `/guilds/${guildId}/ai/kb`,
	aiKbEntry: (guildId: string, entryId: string) =>
		`/guilds/${guildId}/ai/kb/${entryId}`,
} as const;
