export const config = {
	apiBaseUrl: import.meta.env.VITE_API_BASE_URL,
	botInviteUrl: import.meta.env.VITE_BOT_INVITE_URL,
	useMsw: import.meta.env.VITE_USE_MSW === "true",
	environment: import.meta.env.VITE_APP_ENVIRONMENT,
} as const;
