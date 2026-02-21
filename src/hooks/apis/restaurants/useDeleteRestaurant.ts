import { useMutation, useQueryClient } from "@tanstack/react-query";

import { restaurantKeys, restaurantMutationOptions } from "#/apis/restaurants";

export const useDeleteRestaurant = () => {
	const queryClient = useQueryClient();

	return useMutation({
		...restaurantMutationOptions.deleteById(),
		onSuccess: async (_data, id) => {
			await Promise.all([
				queryClient.invalidateQueries({
					queryKey: restaurantKeys.lists(),
				}),
				queryClient.invalidateQueries({
					queryKey: restaurantKeys.detail(id),
				}),
			]);
		},
	});
};
