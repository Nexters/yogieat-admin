import { useQuery } from "@tanstack/react-query";

import { restaurantQueryOptions } from "#/apis/restaurants";

export const useGetRestaurantById = (id: number, enabled = true) => {
	return useQuery({
		...restaurantQueryOptions.detail(id),
		enabled,
	});
};
