import axios from "axios";
import { config } from "@/settings/config";

export const http = axios.create({
	baseURL: config.apiBaseUrl,
	withCredentials: true,
});

http.interceptors.response.use(
	(r) => r,
	(error: unknown) => {
		if (
			axios.isAxiosError(error) &&
			error.response?.status === 401 &&
			window.location.pathname !== "/"
		) {
			window.location.assign("/");
		}
		return Promise.reject(
			error instanceof Error ? error : new Error(String(error))
		);
	}
);

export default http;
