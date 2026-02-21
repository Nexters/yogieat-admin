import { queryOptions } from "@tanstack/react-query";

import {
	searchRestaurants,
	getRegions,
	getSyncRestaurantJob,
	getCategories,
	getRestaurantById,
	getRestaurants,
} from "#/apis/restaurants/api";
import { restaurantKeys } from "#/apis/restaurants/queryKey";
import type { RestaurantListQuery } from "#/apis/restaurants/type";

export const restaurantQueryOptions = {
	search: (keyword: string) =>
		queryOptions({
			queryKey: restaurantKeys.search(keyword.trim()),
			queryFn: () => searchRestaurants(keyword),
		}),
	regions: () =>
		queryOptions({
			queryKey: restaurantKeys.regions(),
			queryFn: getRegions,
		}),
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
