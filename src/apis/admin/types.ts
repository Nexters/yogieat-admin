import type { AdminSession, LoginRequest, TokenBundle } from "#/apis/auth";
import type {
	DataIssue,
	DataIssueSeverity,
	GatheringDashboardData,
	GatheringDetail,
	GatheringItem,
	GatheringListItem,
	GatheringListQuery,
	ParticipantDistanceRange,
	ParticipantItem,
	ParticipantRole,
} from "#/apis/gatherings";
import type {
	RegionCreateRequest,
	RegionDetail,
	RegionListQuery,
	RegionListResponse,
	RegionPatchRequest,
} from "#/apis/regions";
import type {
	PageResponse,
	RestaurantDetail,
	CategoryOption,
	RestaurantListItem,
	RestaurantListQuery,
	RestaurantRegion,
	RestaurantPatchRequest,
	RestaurantSearchItem,
	RestaurantSearchResponse,
	RestaurantCreateRequest,
	RestaurantCreateResponse,
	RestaurantRegionsResponse,
	CreateRestaurantSyncJobResponse,
	GetRestaurantSyncJobResponse,
	TimeSlot,
} from "#/apis/restaurants";

export type {
	AdminSession,
	CategoryOption,
	DataIssue,
	DataIssueSeverity,
	GatheringDashboardData,
	GatheringDetail,
	GatheringItem,
	GatheringListItem,
	GatheringListQuery,
	LoginRequest,
	PageResponse,
	ParticipantDistanceRange,
	ParticipantItem,
	ParticipantRole,
	RegionCreateRequest,
	RegionDetail,
	RegionListQuery,
	RegionListResponse,
	RegionPatchRequest,
	RestaurantDetail,
	RestaurantListItem,
	RestaurantListQuery,
	RestaurantRegion,
	RestaurantPatchRequest,
	RestaurantSearchItem,
	RestaurantSearchResponse,
	RestaurantCreateRequest,
	RestaurantCreateResponse,
	RestaurantRegionsResponse,
	CreateRestaurantSyncJobResponse,
	GetRestaurantSyncJobResponse,
	TimeSlot,
	TokenBundle,
};

export type AdminService = {
	login: (request: LoginRequest) => Promise<AdminSession>;
	logout: () => Promise<void>;
	searchRestaurants: (keyword: string) => Promise<RestaurantSearchResponse>;
	createRestaurant: (
		request: RestaurantCreateRequest,
	) => Promise<RestaurantCreateResponse>;
	getRegions: () => Promise<RestaurantRegionsResponse>;
	getRegionSummaries: (
		query?: RegionListQuery,
	) => Promise<RegionListResponse>;
	getRegionById: (id: number) => Promise<RegionDetail | null>;
	createRegion: (request: RegionCreateRequest) => Promise<RegionDetail>;
	updateRegion: (
		id: number,
		patch: RegionPatchRequest,
	) => Promise<RegionDetail>;
	deleteRegion: (id: number) => Promise<void>;
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
	deleteRestaurant: (id: number) => Promise<void>;
	syncRestaurant: (id: number) => Promise<CreateRestaurantSyncJobResponse>;
	syncAllRestaurants: () => Promise<CreateRestaurantSyncJobResponse>;
	getSyncRestaurantJob: (
		jobId: number,
	) => Promise<GetRestaurantSyncJobResponse>;
};
