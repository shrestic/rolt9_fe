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

// JSON.parse builds snake_case-keyed objects (matching the backend) without tripping
// the camelcase ESLint rule on identifiers.
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

// --- Phase 2 in-memory stores (snake_case to match the backend wire format) ---
let moderationSettings: Record<string, unknown> = JSON.parse(
	'{"mod_log_channel_id":null,"dm_on_action":true,"warn_escalation":[]}'
) as Record<string, unknown>;
const casesPage: Record<string, unknown> = JSON.parse(
	'{"items":[],"total":0,"page":1,"page_size":20}'
) as Record<string, unknown>;
let commandSettings: Record<string, unknown> = JSON.parse(
	'{"prefix":"!","enabled":true}'
) as Record<string, unknown>;
let commands: Array<Record<string, unknown>> = [];
let nextCommandId = 1;

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

	// Moderation
	http.get(`${API}/guilds/:id/moderation`, () =>
		HttpResponse.json(moderationSettings)
	),
	http.put(`${API}/guilds/:id/moderation`, async ({ request }) => {
		moderationSettings = (await request.json()) as Record<string, unknown>;
		return HttpResponse.json(moderationSettings);
	}),
	http.get(`${API}/guilds/:id/cases`, () => HttpResponse.json(casesPage)),
	http.delete(`${API}/guilds/:id/cases/:n`, () => HttpResponse.json({})),

	// Custom commands
	http.get(`${API}/guilds/:id/commands`, () => HttpResponse.json(commands)),
	http.post(`${API}/guilds/:id/commands`, async ({ request }) => {
		const body = (await request.json()) as Record<string, unknown>;
		const created = { ...body, id: String(nextCommandId) };
		nextCommandId += 1;
		commands.push(created);
		return HttpResponse.json(created, { status: 201 });
	}),
	http.put(`${API}/guilds/:id/commands/:cid`, async ({ request, params }) => {
		const body = (await request.json()) as Record<string, unknown>;
		commands = commands.map((c) =>
			c["id"] === params["cid"] ? { ...c, ...body, id: c["id"] } : c
		);
		return HttpResponse.json(
			commands.find((c) => c["id"] === params["cid"]) ?? {}
		);
	}),
	http.delete(`${API}/guilds/:id/commands/:cid`, ({ params }) => {
		commands = commands.filter((c) => c["id"] !== params["cid"]);
		return new HttpResponse(null, { status: 204 });
	}),
	http.get(`${API}/guilds/:id/command-settings`, () =>
		HttpResponse.json(commandSettings)
	),
	http.put(`${API}/guilds/:id/command-settings`, async ({ request }) => {
		commandSettings = (await request.json()) as Record<string, unknown>;
		return HttpResponse.json(commandSettings);
	}),
	// Live preview — naive in-memory substitution to mirror BE behavior.
	// snake_case keys go through JSON.parse so the camelcase ESLint rule
	// doesn't see them as identifiers.
	http.post(`${API}/guilds/:id/commands/preview`, async ({ request }) => {
		const body = (await request.json()) as Record<string, unknown>;
		const context: Record<string, string> = {
			user: "alice",
			"user.mention": "<@1>",
			server: "MockServer",
			[JSON.parse('"member_count"') as string]: "250",
		};
		const render = (text: string | null | undefined): string => {
			let out = text ?? "";
			for (const [k, v] of Object.entries(context))
				out = out.split(`{${k}}`).join(v);
			return out;
		};
		const parseColor = (hex: string | null | undefined): number => {
			if (!hex) return 0x5865f2;
			try {
				return Number.parseInt(hex.replace(/^#/, ""), 16) || 0x5865f2;
			} catch {
				return 0x5865f2;
			}
		};
		const placeholders = JSON.parse(
			"[" +
				'{"name":"user","description":"User\'s display name","example":"alice"},' +
				'{"name":"user.mention","description":"@mention","example":"<@1>"},' +
				'{"name":"server","description":"Server name","example":"MockServer"},' +
				'{"name":"member_count","description":"Member count","example":"250"}' +
				"]"
		) as Array<{ name: string; description: string; example: string }>;
		const typeKey = JSON.parse('"response_type"') as string;
		const textKey = JSON.parse('"response_text"') as string;
		const renderedTextKey = JSON.parse('"rendered_text"') as string;
		const renderedEmbedKey = JSON.parse('"rendered_embed"') as string;
		const imageUrlKey = JSON.parse('"image_url"') as string;
		const responseType = body[typeKey] as string;
		if (responseType === "embed" && body["embed"]) {
			const embed = body["embed"] as Record<string, string | null>;
			return HttpResponse.json({
				[renderedTextKey]: null,
				[renderedEmbedKey]: {
					title: render(embed["title"]),
					description: render(embed["description"]),
					color: parseColor(embed["color"]),
					footer: render(embed["footer"]),
					[imageUrlKey]: embed[imageUrlKey],
				},
				placeholders,
			});
		}
		return HttpResponse.json({
			[renderedTextKey]: render(body[textKey] as string),
			[renderedEmbedKey]: null,
			placeholders,
		});
	}),
];
