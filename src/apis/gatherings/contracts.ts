export const GATHERING_ENDPOINT_CONTRACTS = {
	getGatherings: {
		method: "GET",
		path: "/gatherings",
		query: [
			"page",
			"size",
			"keyword?",
			"region?",
			"timeSlot?",
			"includeDeleted?",
		],
		response: "PageResponse<GatheringListItem>",
	},
	getGatheringById: {
		method: "GET",
		path: "/gatherings/:id",
		response: "GatheringDetail | null",
	},
	getGatheringDashboard: {
		method: "GET",
		path: "/gatherings/dashboard",
		response: "GatheringDashboardData",
	},
} as const;
