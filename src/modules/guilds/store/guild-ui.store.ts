import { create } from "zustand";

type GuildUiState = {
	invitePolling: boolean;
	startInvitePolling: () => void;
	stopInvitePolling: () => void;
};

export const useGuildUiStore = create<GuildUiState>((set) => ({
	invitePolling: false,
	startInvitePolling: (): void => {
		set({ invitePolling: true });
	},
	stopInvitePolling: (): void => {
		set({ invitePolling: false });
	},
}));
