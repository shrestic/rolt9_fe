import { objectToSnake } from "ts-case-convert";
import { http } from "@/utils/http";
import { endpoints } from "@/settings/endpoints";
import type {
	CommandPreviewInput,
	CustomCommandInput,
} from "@/data/models/command";

export type CommandRemoteDataSource = {
	list: (guildId: string) => Promise<unknown>;
	create: (guildId: string, input: CustomCommandInput) => Promise<unknown>;
	update: (
		guildId: string,
		commandId: string,
		input: CustomCommandInput
	) => Promise<unknown>;
	remove: (guildId: string, commandId: string) => Promise<void>;
	getSettings: (guildId: string) => Promise<unknown>;
	updateSettings: (
		guildId: string,
		input: { prefix: string; enabled: boolean }
	) => Promise<unknown>;
	preview: (guildId: string, input: CommandPreviewInput) => Promise<unknown>;
};

export const makeCommandRemote = (client = http): CommandRemoteDataSource => ({
	list: async (guildId) =>
		(await client.get(endpoints.commands(guildId))).data as unknown,
	create: async (guildId, input) =>
		(await client.post(endpoints.commands(guildId), objectToSnake(input)))
			.data as unknown,
	update: async (guildId, commandId, input) =>
		(
			await client.put(
				endpoints.command(guildId, commandId),
				objectToSnake(input)
			)
		).data as unknown,
	remove: async (guildId, commandId): Promise<void> => {
		await client.delete(endpoints.command(guildId, commandId));
	},
	getSettings: async (guildId) =>
		(await client.get(endpoints.commandSettings(guildId))).data as unknown,
	updateSettings: async (guildId, input) =>
		(await client.put(endpoints.commandSettings(guildId), objectToSnake(input)))
			.data as unknown,
	preview: async (guildId, input) =>
		(await client.post(endpoints.commandPreview(guildId), objectToSnake(input)))
			.data as unknown,
});
