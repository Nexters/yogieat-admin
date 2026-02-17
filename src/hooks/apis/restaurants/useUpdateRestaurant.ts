import { useMutation, useQueryClient } from "@tanstack/react-query";

import { restaurantKeys, restaurantMutationOptions } from "#/apis/restaurants";

export const useUpdateRestaurant = () => {
	const queryClient = useQueryClient();

	return useMutation({
		...restaurantMutationOptions.update(),
		onSuccess: async (_data, variables) => {
			await Promise.all([
				queryClient.invalidateQueries({
					queryKey: restaurantKeys.detail(variables.id),
				}),
				queryClient.invalidateQueries({
					queryKey: restaurantKeys.lists(),
				}),
			]);
		},
	});
};
