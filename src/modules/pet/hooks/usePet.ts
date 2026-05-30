import {
	useMutation,
	useQuery,
	useQueryClient,
	type UseMutationResult,
	type UseQueryResult,
} from "@tanstack/react-query";
import { usePetRepository } from "@/di/RepositoriesProvider";
import type {
	PetSettings,
	PetSettingsInput,
	PetStatus,
} from "@/data/models/pet";

// Reads the guild's pet settings. Cached briefly so navigating back and
// forth between tabs doesn't re-fetch on every mount.
export const usePetSettings = (
	guildId: string
): UseQueryResult<PetSettings> => {
	const repo = usePetRepository();
	return useQuery({
		queryKey: ["pet-settings", guildId],
		queryFn: () => repo.getSettings(guildId),
		staleTime: 30 * 1000,
	});
};

// Persists settings changes. On success we prime both the settings and status
// caches so the UI reflects the saved state immediately without a second fetch.
export const useUpdatePetSettings = (
	guildId: string
): UseMutationResult<PetSettings, Error, PetSettingsInput> => {
	const repo = usePetRepository();
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (input: PetSettingsInput) =>
			repo.updateSettings(guildId, input),
		onSuccess: (data) => {
			// Update settings cache with the server's response.
			qc.setQueryData(["pet-settings", guildId], data);
			// Invalidate status so the status card re-fetches (enabled flag may
			// have changed, which affects what the card renders).
			void qc.invalidateQueries({ queryKey: ["pet-status", guildId] });
		},
	});
};

// Reads the live state of the pet (hunger, happiness, level, stage, etc.).
// Shorter stale time since the pet's stats can change via Discord commands.
export const usePetStatus = (
	guildId: string
): UseQueryResult<PetStatus> => {
	const repo = usePetRepository();
	return useQuery({
		queryKey: ["pet-status", guildId],
		queryFn: () => repo.getStatus(guildId),
		staleTime: 30 * 1000,
	});
};
