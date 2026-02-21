import { useQuery } from "@tanstack/react-query";

import { restaurantQueryOptions } from "#/apis/restaurants";

export const useGetRegions = (enabled = true) => {
	return useQuery({
		...restaurantQueryOptions.regions(),
		enabled,
	});
};
