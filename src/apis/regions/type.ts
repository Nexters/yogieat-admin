export type RegionCoordinates = {
	coordinates: [number, number];
	type?: "Point" | string;
};

export type RegionSummary = {
	id: number;
	code: string;
	displayName: string;
	coordinatesStandard: RegionCoordinates;
	active: boolean;
	sortOrder: number;
	restaurantCount: number;
};

export type RegionDetail = RegionSummary;

export type RegionListResponse = {
	regions: RegionSummary[];
};

export type RegionCoordinatesRequest = {
	coordinates: [number, number];
};

export type RegionCreateRequest = {
	code: string;
	displayName: string;
	coordinatesStandard: RegionCoordinatesRequest;
	active?: boolean;
	sortOrder?: number;
};

export type RegionPatchRequest = Partial<RegionCreateRequest>;
