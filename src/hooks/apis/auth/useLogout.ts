import { useMutation } from "@tanstack/react-query";

import { authMutationOptions } from "#/apis/auth";

export const useLogout = () => {
	return useMutation(authMutationOptions.logout());
};
