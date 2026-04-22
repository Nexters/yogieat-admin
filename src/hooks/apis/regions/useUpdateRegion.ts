import { useMutation, useQueryClient } from "@tanstack/react-query";

import { regionKeys, regionMutationOptions } from "#/apis/regions";
import { restaurantKeys } from "#/apis/restaurants";

export const useUpdateRegion = () => {
	const queryClient = useQueryClient();

	return useMutation({
		...regionMutationOptions.update(),
		onSuccess: async (_data, variables) => {
			await Promise.all([
				queryClient.invalidateQueries({
					queryKey: regionKeys.lists(),
				}),
				queryClient.invalidateQueries({
					queryKey: regionKeys.detail(variables.id),
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
