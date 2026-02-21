export const RESTAURANT_ENDPOINT_CONTRACTS = {
	getCategories: {
		method: "GET",
		path: "/categories",
		response: "CategoryOption[]",
	},
	searchRestaurants: {
		method: "GET",
		path: "/restaurants/search",
		query: ["keyword"],
		response: "RestaurantSearchResponse",
	},
	createRestaurant: {
		method: "POST",
		path: "/restaurants",
		request: "RestaurantCreateRequest",
		response: "RestaurantCreateResponse",
	},
	getRegions: {
		method: "GET",
		path: "/regions",
		response: "RestaurantRegionsResponse",
	},
	getRestaurants: {
		method: "GET",
		path: "/restaurants",
		query: [
			"page",
			"size",
			"keyword?",
			"region?",
			"largeCategory?",
			"categoryId?",
		],
		response: "PageResponse<RestaurantListItem>",
	},
	getRestaurantById: {
		method: "GET",
		path: "/restaurants/:id",
		response: "RestaurantDetail | null",
	},
	updateRestaurant: {
		method: "PATCH",
		path: "/restaurants/:id",
		request: "RestaurantPatchRequest",
		response: "RestaurantDetail",
	},
	deleteRestaurant: {
		method: "DELETE",
		path: "/restaurants/:id",
		response: "void",
	},
	getSyncRestaurantJob: {
		method: "GET",
		path: "/restaurants/sync-jobs/:jobId",
		response: "GetRestaurantSyncJobResponse",
	},
	syncRestaurant: {
		method: "POST",
		path: "/restaurants/:id/sync-jobs",
		response: "CreateRestaurantSyncJobResponse",
	},
	syncAllRestaurants: {
		method: "POST",
		path: "/restaurants/sync-jobs/all",
		response: "CreateRestaurantSyncJobResponse",
	},
} as const;
