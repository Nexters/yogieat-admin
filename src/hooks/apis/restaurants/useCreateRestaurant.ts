import { useMutation, useQueryClient } from "@tanstack/react-query";

import { restaurantKeys, restaurantMutationOptions } from "#/apis/restaurants";

export const useCreateRestaurant = () => {
	const queryClient = useQueryClient();

	return useMutation({
		...restaurantMutationOptions.create(),
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: restaurantKeys.lists(),
			});
		},
	});
};
