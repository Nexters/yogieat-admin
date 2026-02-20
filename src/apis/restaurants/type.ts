export type TimeSlot = "LUNCH" | "DINNER" | "BOTH";

export type RestaurantSyncScope = "ALL" | "SINGLE" | (string & {});
export type RestaurantSyncTriggerType = "MANUAL" | (string & {});
export type RestaurantSyncJobStatus = "PENDING" | "RUNNING" | "COMPLETED" | "FAILED";

export type GeoJsonPoint = {
	coordinates: [number, number];
};

export type RestaurantListItem = {
	id: number;
	name: string;
	categoryId: number | null;
	largeCategory?: string | null;
	mediumCategory?: string | null;
	rating: number | null;
	imageUrl?: string | null;
	region: string;
	updatedAt: string;
};

export type RestaurantDetail = {
	id: number;
	externalId: string;
	categoryId: number | null;
	largeCategory?: string | null;
	mediumCategory?: string | null;
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

export type CreateRestaurantSyncJobResponse = {
	jobId: number;
	scope: RestaurantSyncScope;
	triggerType: RestaurantSyncTriggerType;
	status: RestaurantSyncJobStatus;
	targetRestaurantId: number | null;
	createdAt: string;
};

export type GetRestaurantSyncJobResponse = {
	jobId: number;
	scope: RestaurantSyncScope;
	triggerType: RestaurantSyncTriggerType;
	status: RestaurantSyncJobStatus;
	targetRestaurantId: number | null;
	chunkSize: number;
	parallelism: number;
	totalCount: number;
	processedCount: number;
	successCount: number;
	failedCount: number;
	errorSummary: string | null;
	startedAt: string | null;
	finishedAt: string | null;
	createdAt: string;
	updatedAt: string;
};

export type SyncResult = GetRestaurantSyncJobResponse;

export type PageResponse<T> = {
	content: T[];
	page: number;
	size: number;
	totalElements: number;
	totalPages: number;
	hasNext: boolean;
};
