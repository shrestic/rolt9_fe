import axios from "axios";
import type { AuthenticationRemoteDataSource } from "@/data/datasource/remote/authentication.remote";
import { toUser, type User } from "@/data/models/user";
import { UnauthorizedException } from "@/data/exception/authentication.exception";

export type AuthenticationRepository = {
	getMe: () => Promise<User>;
	logout: () => Promise<void>;
};

export const makeAuthenticationRepository = (
	remote: AuthenticationRemoteDataSource
): AuthenticationRepository => ({
	getMe: async (): Promise<User> => {
		try {
			return toUser(await remote.getMe());
		} catch (error) {
			if (axios.isAxiosError(error) && error.response?.status === 401) {
				throw new UnauthorizedException(error);
			}
			throw error;
		}
	},
	logout: (): Promise<void> => remote.logout(),
});
