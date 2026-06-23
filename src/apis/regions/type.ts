export type RegionStatus = "ACTIVE" | "PENDING" | "INACTIVE";

export type RegionCoordinates = {
	coordinates: [number, number];
	type?: "Point" | string;
};

export type RegionSummary = {
	id: number;
	code: string;
	displayName: string;
	province: string;
	coordinatesStandard: RegionCoordinates;
	status: RegionStatus;
	sortOrder: number;
	restaurantCount: number;
};

export type RegionDetail = RegionSummary;

export type RegionListResponse = {
	regions: RegionSummary[];
};

export type RegionListQuery = {
	province?: string;
};

export type RegionCoordinatesRequest = {
	coordinates: [number, number];
};

export type RegionCreateRequest = {
	code: string;
	displayName: string;
	province?: string;
	coordinatesStandard: RegionCoordinatesRequest;
	status?: RegionStatus;
	sortOrder?: number;
};

export type RegionPatchRequest = Partial<RegionCreateRequest>;
