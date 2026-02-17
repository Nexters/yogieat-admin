import { useMutation, useQueryClient } from "@tanstack/react-query";

import { restaurantKeys, restaurantMutationOptions } from "#/apis/restaurants";

export const useSyncRestaurant = () => {
	const queryClient = useQueryClient();

	return useMutation({
		...restaurantMutationOptions.syncById(),
		onSuccess: async (_data, id) => {
			await Promise.all([
				queryClient.invalidateQueries({
					queryKey: restaurantKeys.detail(id),
				}),
				queryClient.invalidateQueries({
					queryKey: restaurantKeys.lists(),
				}),
			]);
		},
	});
};
