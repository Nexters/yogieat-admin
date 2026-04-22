import { useMutation, useQueryClient } from "@tanstack/react-query";

import { regionKeys, regionMutationOptions } from "#/apis/regions";
import { restaurantKeys } from "#/apis/restaurants";

export const useDeleteRegion = () => {
	const queryClient = useQueryClient();

	return useMutation({
		...regionMutationOptions.deleteById(),
		onSuccess: async (_data, id) => {
			await Promise.all([
				queryClient.invalidateQueries({
					queryKey: regionKeys.lists(),
				}),
				queryClient.invalidateQueries({
					queryKey: regionKeys.detail(id),
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
