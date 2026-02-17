import { mutationOptions } from "@tanstack/react-query";

import { login, logout } from "#/apis/auth/api";
import { authKeys } from "#/apis/auth/queryKey";
import type { LoginRequest } from "#/apis/auth/type";

export const authMutationOptions = {
	login: () =>
		mutationOptions({
			mutationKey: authKeys.login(),
			mutationFn: (request: LoginRequest) => login(request),
		}),
	logout: () =>
		mutationOptions({
			mutationKey: authKeys.logout(),
			mutationFn: () => logout(),
		}),
};
