import { queryOptions } from "@tanstack/react-query";

import {
	getSyncRestaurantJob,
	getCategories,
	getRestaurantById,
	getRestaurants,
} from "#/apis/restaurants/api";
import { restaurantKeys } from "#/apis/restaurants/queryKey";
import type { RestaurantListQuery } from "#/apis/restaurants/type";

export const restaurantQueryOptions = {
	categories: () =>
		queryOptions({
			queryKey: restaurantKeys.categories(),
			queryFn: getCategories,
		}),
	list: (query: RestaurantListQuery) =>
		queryOptions({
			queryKey: restaurantKeys.list(query),
			queryFn: () => getRestaurants(query),
		}),
	detail: (id: number) =>
		queryOptions({
			queryKey: restaurantKeys.detail(id),
			queryFn: () => getRestaurantById(id),
		}),
	syncJob: (jobId: number) =>
		queryOptions({
			queryKey: restaurantKeys.syncJob(jobId),
			queryFn: () => getSyncRestaurantJob(jobId),
		}),
};
