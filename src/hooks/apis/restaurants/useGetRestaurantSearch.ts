import { useQuery } from "@tanstack/react-query";

import { restaurantQueryOptions } from "#/apis/restaurants";

export const useGetRestaurantSearch = (keyword: string, enabled = true) => {
	const normalizedKeyword = keyword.trim();

	return useQuery({
		...restaurantQueryOptions.search(normalizedKeyword),
		enabled: enabled && Boolean(normalizedKeyword),
	});
};

export const useSearchRestaurants = (
	keyword: string,
	enabled = true,
) => useGetRestaurantSearch(keyword, enabled);
