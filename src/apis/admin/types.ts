export type TimeSlot =
	| "BREAKFAST"
	| "LUNCH"
	| "DINNER"
	| "LATE_NIGHT"
	| "ANY"
	| "BOTH";

export type SyncStatus = "PENDING" | "RUNNING" | "COMPLETED" | "FAILED";

export type ParticipantRole = "HOST" | "MEMBER" | string;
export type ParticipantDistanceRange =
	| "RANGE_500M"
	| "RANGE_1KM"
	| "ANY"
	| string;
export type DataIssueSeverity = "INFO" | "WARN" | "ERROR";

export type GeoJsonPoint = {
	coordinates: [number, number];
};

export type TokenBundle = {
	accessToken: string;
	refreshToken: string;
	expiresAt: string;
};

export type AdminSession = {
	adminId: string;
	name: string;
	roles: string[];
	tokenBundle: TokenBundle;
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

export type PageResponse<T> = {
	content: T[];
	page: number;
	size: number;
	totalElements: number;
	totalPages: number;
	hasNext: boolean;
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

export type GatheringItem = {
	id: number;
	accessKey: string;
	title: string | null;
	scheduledDate: string;
	timeSlot: string;
	region: string;
	peopleCount: number;
	deletedAt: string | null;
	createdAt: string;
	updatedAt: string;
};

export type GatheringListItem = {
	id: number;
	title: string | null;
	accessKey: string;
	scheduledDate: string;
	timeSlot: string;
	region: string;
	peopleCount: number;
	participantCount: number;
	fillRate: number;
	deletedAt: string | null;
	updatedAt: string;
};

export type GatheringListQuery = {
	page: number;
	size: number;
	keyword?: string;
	region?: string;
	timeSlot?: string;
	includeDeleted?: boolean;
};

export type ParticipantItem = {
	id: number;
	gatheringId: number | null;
	nickname: string;
	role: ParticipantRole;
	distanceRange: ParticipantDistanceRange;
	preferences: string[];
	dislikes: string;
	createdAt: string;
	updatedAt: string;
};

export type DataIssue = {
	id: string;
	severity: DataIssueSeverity;
	title: string;
	description: string;
	relatedId?: number;
};

export type GatheringDashboardData = {
	generatedAt: string;
	gatherings: GatheringItem[];
	participants: ParticipantItem[];
	issues: DataIssue[];
};

export type GatheringDetail = {
	gathering: GatheringItem;
	participants: ParticipantItem[];
	participantCount: number;
	fillRate: number;
};

export type LoginRequest = {
	userId: string;
	password: string;
};

export type AdminService = {
	login: (request: LoginRequest) => Promise<AdminSession>;
	logout: () => Promise<void>;
	getCategories: () => Promise<CategoryOption[]>;
	getGatheringDashboard: () => Promise<GatheringDashboardData>;
	getGatherings: (
		query: GatheringListQuery,
	) => Promise<PageResponse<GatheringListItem>>;
	getGatheringById: (id: number) => Promise<GatheringDetail | null>;
	getRestaurants: (
		query: RestaurantListQuery,
	) => Promise<PageResponse<RestaurantListItem>>;
	getRestaurantById: (id: number) => Promise<RestaurantDetail | null>;
	updateRestaurant: (
		id: number,
		patch: RestaurantPatchRequest,
	) => Promise<RestaurantDetail>;
	syncRestaurant: (id: number) => Promise<SyncResult>;
	syncAllRestaurants: () => Promise<SyncResult>;
};
