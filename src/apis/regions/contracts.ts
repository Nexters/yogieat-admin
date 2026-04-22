export const REGION_ENDPOINT_CONTRACTS = {
	getRegions: {
		method: "GET",
		path: "/regions",
		response: "RegionListResponse",
	},
	getRegionById: {
		method: "GET",
		path: "/regions/:id",
		response: "RegionDetail | null",
	},
	createRegion: {
		method: "POST",
		path: "/regions",
		request: "RegionCreateRequest",
		response: "RegionDetail",
	},
	updateRegion: {
		method: "PATCH",
		path: "/regions/:id",
		request: "RegionPatchRequest",
		response: "RegionDetail",
	},
	deleteRegion: {
		method: "DELETE",
		path: "/regions/:id",
		response: "void",
	},
} as const;
