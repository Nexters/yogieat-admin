import { useMutation } from "@tanstack/react-query";

import { authMutationOptions } from "#/apis/auth";

export const useLogin = () => {
	return useMutation(authMutationOptions.login());
};
