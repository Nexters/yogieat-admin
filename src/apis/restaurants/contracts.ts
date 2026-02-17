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
		method: "PUT",
		path: "/restaurants/:id",
		request: "RestaurantPatchRequest",
		response: "RestaurantDetail",
	},
	syncRestaurant: {
		method: "POST",
		path: "/restaurants/:id/sync",
		response: "SyncResult",
	},
	syncAllRestaurants: {
		method: "POST",
		path: "/restaurants/sync",
		response: "SyncResult",
	},
} as const;
