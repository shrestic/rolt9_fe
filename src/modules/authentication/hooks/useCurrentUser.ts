import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { useAuthRepository } from "@/di/RepositoriesProvider";
import type { User } from "@/data/models/user";

export const useCurrentUser = (): UseQueryResult<User> => {
	const repo = useAuthRepository();
	return useQuery({
		queryKey: ["me"],
		queryFn: () => repo.getMe(),
		retry: false,
		staleTime: 5 * 60 * 1000,
	});
};
