import { http, HttpResponse } from "msw";
import { config } from "@/settings/config";

const API = config.apiBaseUrl;

type UserResponse = {
	id: string;
	discord_id: number;
	username: string;
	avatar_url: string | null;
};

type GuildSummaryResponse = {
	discord_id: string;
	name: string;
	icon_url: string | null;
	bot_present: boolean;
	can_manage: boolean;
};

type GuildOverviewResponse = {
	discord_id: string;
	name: string;
	icon_url: string | null;
	member_count: number;
	channels: Array<{ id: string; name: string; type: number }>;
	roles: Array<{ id: string; name: string }>;
	bot_present: boolean;
};

// JSON.parse is used to construct objects with snake_case keys (matching the backend API
// response format) without triggering the camelcase ESLint rule on identifier names.
const mockUser: UserResponse = JSON.parse(
	'{"id":"u1","discord_id":1,"username":"dev","avatar_url":null}'
) as UserResponse;

const mockGuilds: Array<GuildSummaryResponse> = JSON.parse(
	"[" +
		'{"discord_id":"100","name":"Dev Server (bot in)","icon_url":null,"bot_present":true,"can_manage":true},' +
		'{"discord_id":"200","name":"Dev Server (no bot)","icon_url":null,"bot_present":false,"can_manage":true}' +
		"]"
) as Array<GuildSummaryResponse>;

function makeMockOverview(guildId: string): GuildOverviewResponse {
	const template =
		`{"discord_id":${JSON.stringify(guildId)},"name":"Dev Server","icon_url":null,` +
		`"member_count":7,"channels":[{"id":"1","name":"general","type":0}],` +
		`"roles":[{"id":"1","name":"@everyone"}],"bot_present":true}`;
	return JSON.parse(template) as GuildOverviewResponse;
}

export const handlers = [
	http.get(`${API}/me`, () => HttpResponse.json(mockUser)),
	http.get(`${API}/me/guilds`, () => HttpResponse.json(mockGuilds)),
	http.get(`${API}/guilds/:id/overview`, ({ params }) => {
		const rawId = params["id"];
		const guildId = Array.isArray(rawId)
			? (rawId[0] ?? "")
			: typeof rawId === "string"
				? rawId
				: "";
		return HttpResponse.json(makeMockOverview(guildId));
	}),
];
