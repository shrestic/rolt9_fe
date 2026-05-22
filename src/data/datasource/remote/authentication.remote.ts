import { http } from "@/utils/http";
import { endpoints } from "@/settings/endpoints";

export type AuthenticationRemoteDataSource = {
	getMe: () => Promise<unknown>;
	logout: () => Promise<void>;
};

export const makeAuthenticationRemote = (
	client = http
): AuthenticationRemoteDataSource => ({
	getMe: async (): Promise<unknown> =>
		(await client.get(endpoints.me())).data as unknown,
	logout: async (): Promise<void> => {
		await client.post(endpoints.authLogout());
	},
});
