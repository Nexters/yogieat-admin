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
	CategoryOption,
	PageResponse,
	RestaurantDetail,
	RestaurantListItem,
	RestaurantListQuery,
	RestaurantPatchRequest,
	SyncResult,
	SyncStatus,
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
	RestaurantDetail,
	RestaurantListItem,
	RestaurantListQuery,
	RestaurantPatchRequest,
	SyncResult,
	SyncStatus,
	TimeSlot,
	TokenBundle,
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
