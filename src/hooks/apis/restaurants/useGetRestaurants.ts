import { useQuery } from "@tanstack/react-query";

import {
	restaurantQueryOptions,
	type RestaurantListQuery,
} from "#/apis/restaurants";

export const useGetRestaurants = (query: RestaurantListQuery) => {
	return useQuery(restaurantQueryOptions.list(query));
};
