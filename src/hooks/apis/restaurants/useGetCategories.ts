import { useQuery } from "@tanstack/react-query";

import { restaurantQueryOptions } from "#/apis/restaurants";

export const useGetCategories = () => {
	return useQuery(restaurantQueryOptions.categories());
};
