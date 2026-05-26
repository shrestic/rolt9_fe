import type { CommandRemoteDataSource } from "@/data/datasource/remote/command.remote";
import {
	toCommand,
	toCommandPreview,
	toCommandSettings,
	toCommands,
	type CommandPreview,
	type CommandPreviewInput,
	type CommandSettings,
	type CustomCommand,
	type CustomCommandInput,
} from "@/data/models/command";

export type CommandRepository = {
	list: (guildId: string) => Promise<Array<CustomCommand>>;
	create: (
		guildId: string,
		input: CustomCommandInput
	) => Promise<CustomCommand>;
	update: (
		guildId: string,
		commandId: string,
		input: CustomCommandInput
	) => Promise<CustomCommand>;
	remove: (guildId: string, commandId: string) => Promise<void>;
	getSettings: (guildId: string) => Promise<CommandSettings>;
	updateSettings: (
		guildId: string,
		input: { prefix: string; enabled: boolean }
	) => Promise<CommandSettings>;
	preview: (
		guildId: string,
		input: CommandPreviewInput
	) => Promise<CommandPreview>;
};

export const makeCommandRepository = (
	remote: CommandRemoteDataSource
): CommandRepository => ({
	list: async (guildId) => toCommands(await remote.list(guildId)),
	create: async (guildId, input) =>
		toCommand(await remote.create(guildId, input)),
	update: async (guildId, commandId, input) =>
		toCommand(await remote.update(guildId, commandId, input)),
	remove: async (guildId, commandId) => remote.remove(guildId, commandId),
	getSettings: async (guildId) =>
		toCommandSettings(await remote.getSettings(guildId)),
	updateSettings: async (guildId, input) =>
		toCommandSettings(await remote.updateSettings(guildId, input)),
	preview: async (guildId, input) =>
		toCommandPreview(await remote.preview(guildId, input)),
});
