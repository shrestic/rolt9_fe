import {
	useMutation,
	useQuery,
	useQueryClient,
	type UseMutationResult,
	type UseQueryResult,
} from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useCommandRepository } from "@/di/RepositoriesProvider";
import type {
	CommandPreview,
	CommandPreviewInput,
	CommandSettings,
	CustomCommand,
	CustomCommandInput,
} from "@/data/models/command";

export const useCommands = (
	guildId: string
): UseQueryResult<Array<CustomCommand>> => {
	const repo = useCommandRepository();
	return useQuery({
		queryKey: ["commands", guildId],
		queryFn: () => repo.list(guildId),
		staleTime: 30 * 1000,
	});
};

export const useCreateCommand = (
	guildId: string
): UseMutationResult<CustomCommand, Error, CustomCommandInput> => {
	const repo = useCommandRepository();
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (input: CustomCommandInput) => repo.create(guildId, input),
		onSuccess: () => qc.invalidateQueries({ queryKey: ["commands", guildId] }),
	});
};

export const useUpdateCommand = (
	guildId: string
): UseMutationResult<
	CustomCommand,
	Error,
	{ commandId: string; input: CustomCommandInput }
> => {
	const repo = useCommandRepository();
	const qc = useQueryClient();
	return useMutation({
		mutationFn: ({
			commandId,
			input,
		}: {
			commandId: string;
			input: CustomCommandInput;
		}) => repo.update(guildId, commandId, input),
		onSuccess: () => qc.invalidateQueries({ queryKey: ["commands", guildId] }),
	});
};

export const useDeleteCommand = (
	guildId: string
): UseMutationResult<void, Error, string> => {
	const repo = useCommandRepository();
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (commandId: string) => repo.remove(guildId, commandId),
		onSuccess: () => qc.invalidateQueries({ queryKey: ["commands", guildId] }),
	});
};

export const useCommandSettings = (
	guildId: string
): UseQueryResult<CommandSettings> => {
	const repo = useCommandRepository();
	return useQuery({
		queryKey: ["command-settings", guildId],
		queryFn: () => repo.getSettings(guildId),
		staleTime: 30 * 1000,
	});
};

export const useUpdateCommandSettings = (
	guildId: string
): UseMutationResult<
	CommandSettings,
	Error,
	{ prefix: string; enabled: boolean }
> => {
	const repo = useCommandRepository();
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (input: { prefix: string; enabled: boolean }) =>
			repo.updateSettings(guildId, input),
		onSuccess: (data) => qc.setQueryData(["command-settings", guildId], data),
	});
};

// Debounce any value by `delay` ms — used to avoid hammering the preview
// endpoint on every keystroke while the admin is typing.
const useDebounced = <T>(value: T, delay = 300): T => {
	const [debounced, setDebounced] = useState(value);
	useEffect(() => {
		const handle = setTimeout(() => {
			setDebounced(value);
		}, delay);
		return (): void => {
			clearTimeout(handle);
		};
	}, [value, delay]);
	return debounced;
};

// Live preview hook. Returns the latest CommandPreview for the given draft —
// re-fetches whenever the debounced input changes. Pass `enabled=false` when
// there's nothing meaningful to render so we don't fire a request for an
// empty form.
export const usePreviewCommand = (
	guildId: string,
	input: CommandPreviewInput,
	enabled = true
): UseQueryResult<CommandPreview> => {
	const repo = useCommandRepository();
	// Stringify the input to use as a stable cache key. JSON serialization is
	// fine here because the input is shallow and serializable.
	const debounced = useDebounced(JSON.stringify(input), 300);
	return useQuery({
		queryKey: ["command-preview", guildId, debounced],
		queryFn: () =>
			repo.preview(guildId, JSON.parse(debounced) as CommandPreviewInput),
		enabled,
		// No caching across keystrokes — each draft string is a fresh key anyway,
		// but mark it short-lived to drop old entries quickly.
		staleTime: 5_000,
		gcTime: 30_000,
	});
};
