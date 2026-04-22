import { useMutation, useQueryClient } from "@tanstack/react-query";

import { regionKeys, regionMutationOptions } from "#/apis/regions";
import { restaurantKeys } from "#/apis/restaurants";

export const useCreateRegion = () => {
	const queryClient = useQueryClient();

	return useMutation({
		...regionMutationOptions.create(),
		onSuccess: async () => {
			await Promise.all([
				queryClient.invalidateQueries({
					queryKey: regionKeys.lists(),
				}),
				queryClient.invalidateQueries({
					queryKey: restaurantKeys.regions(),
				}),
				queryClient.invalidateQueries({
					queryKey: restaurantKeys.lists(),
				}),
				queryClient.invalidateQueries({
					queryKey: restaurantKeys.details(),
				}),
			]);
		},
	});
};
