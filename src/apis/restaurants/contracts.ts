export const RESTAURANT_ENDPOINT_CONTRACTS = {
	getCategories: {
		method: "GET",
		path: "/sdui/categories",
		response: "CategoryOption[]",
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
