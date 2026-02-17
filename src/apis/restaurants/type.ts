export type TimeSlot = "LUNCH" | "DINNER" | "BOTH";

export type SyncStatus = "PENDING" | "RUNNING" | "COMPLETED" | "FAILED";

export type GeoJsonPoint = {
	coordinates: [number, number];
};

export type RestaurantListItem = {
	id: number;
	name: string;
	categoryId: number | null;
	rating: number | null;
	imageUrl?: string | null;
	region: string;
	updatedAt: string;
};

export type RestaurantDetail = {
	id: number;
	externalId: string;
	categoryId: number | null;
	name: string;
	address: string;
	rating: number | null;
	imageUrl: string;
	mapUrl: string;
	representativeReview: string;
	description: string;
	region: string;
	location: GeoJsonPoint | null;
	reviewCount: number | null;
	blogReviewCount: number | null;
	representMenu: string;
	representMenuPrice: number | null;
	priceLevel: string;
	aiMateSummaryTitle: string;
	aiMateSummaryContents: string[];
	timeSlot: TimeSlot;
	createdAt: string;
	updatedAt: string;
};

export type RestaurantPatchRequest = Partial<
	Omit<RestaurantDetail, "id" | "createdAt" | "updatedAt">
>;

export type RestaurantListQuery = {
	page: number;
	size: number;
	keyword?: string;
	region?: string;
	categoryId?: number;
	largeCategory?: string;
};

export type CategoryOption = {
	id: number;
	name: string;
	largeCategory?: string;
	mediumCategory?: string;
	parentId?: number;
	depth?: number;
};

export type SyncResult = {
	jobId: string;
	status: SyncStatus;
	startedAt: string;
	finishedAt?: string;
	message?: string;
};

export type PageResponse<T> = {
	content: T[];
	page: number;
	size: number;
	totalElements: number;
	totalPages: number;
	hasNext: boolean;
};
