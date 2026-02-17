import { useMutation, useQueryClient } from "@tanstack/react-query";

import { restaurantKeys, restaurantMutationOptions } from "#/apis/restaurants";

export const useSyncAllRestaurants = () => {
	const queryClient = useQueryClient();

	return useMutation({
		...restaurantMutationOptions.syncAll(),
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: restaurantKeys.all,
			});
		},
	});
};
