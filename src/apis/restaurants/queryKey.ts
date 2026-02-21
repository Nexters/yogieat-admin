import type { RestaurantListQuery } from "#/apis/restaurants/type";

export const restaurantKeys = {
	all: ["restaurants"] as const,
	regions: () => [...restaurantKeys.all, "regions"] as const,
	searches: () => [...restaurantKeys.all, "search"] as const,
	search: (keyword: string) => [...restaurantKeys.searches(), { keyword }] as const,
	categories: () => [...restaurantKeys.all, "categories"] as const,
	lists: () => [...restaurantKeys.all, "list"] as const,
	list: (query: RestaurantListQuery) =>
		[...restaurantKeys.lists(), query] as const,
	details: () => [...restaurantKeys.all, "detail"] as const,
	detail: (id: number) => [...restaurantKeys.details(), id] as const,
	syncJobs: () => [...restaurantKeys.all, "syncJobs"] as const,
	syncJob: (jobId: number) => [...restaurantKeys.syncJobs(), jobId] as const,
	sync: () => [...restaurantKeys.all, "sync"] as const,
	syncById: (id: number) => [...restaurantKeys.sync(), id] as const,
	syncAll: () => [...restaurantKeys.sync(), "all"] as const,
};
