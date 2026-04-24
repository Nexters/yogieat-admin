import {
	AdminService,
	AdminSession,
	CategoryOption,
	CreateRestaurantSyncJobResponse,
	GatheringDetail,
	GatheringDashboardData,
	GatheringListItem,
	GatheringListQuery,
	GetRestaurantSyncJobResponse,
	LoginRequest,
	PageResponse,
	RegionCreateRequest,
	RegionDetail,
	RegionListResponse,
	RegionListQuery,
	RegionPatchRequest,
	RestaurantCreateRequest,
	RestaurantCreateResponse,
	RestaurantDetail,
	RestaurantListItem,
	RestaurantListQuery,
	RestaurantPatchRequest,
	RestaurantRegionsResponse,
	RestaurantSearchResponse,
} from "#/apis/admin/types";
import { adminMockDb } from "#/mocks/AdminDb";

const wait = (ms: number): Promise<void> =>
	new Promise((resolve) => {
		setTimeout(resolve, ms);
	});

const withDelay = async <T>(ms: number, callback: () => T): Promise<T> => {
	await wait(ms);
	return callback();
};

export const localAdminService: AdminService = {
	login(request: LoginRequest): Promise<AdminSession> {
		return withDelay(180, () => adminMockDb.login(request));
	},

	logout(): Promise<void> {
		return withDelay(60, () => undefined);
	},

	getCategories(): Promise<CategoryOption[]> {
		return withDelay(90, () => adminMockDb.getCategories());
	},

	getGatheringDashboard(): Promise<GatheringDashboardData> {
		return withDelay(160, () => adminMockDb.getGatheringDashboard());
	},

	getGatherings(
		query: GatheringListQuery,
	): Promise<PageResponse<GatheringListItem>> {
		return withDelay(160, () => adminMockDb.getGatherings(query));
	},

	getGatheringById(id: number): Promise<GatheringDetail | null> {
		return withDelay(120, () => adminMockDb.getGatheringById(id));
	},

	searchRestaurants(keyword: string): Promise<RestaurantSearchResponse> {
		return withDelay(130, () => adminMockDb.searchRestaurants(keyword));
	},

	createRestaurant(
		request: RestaurantCreateRequest,
	): Promise<RestaurantCreateResponse> {
		return withDelay(160, () => adminMockDb.createRestaurant(request));
	},

	getRegions(): Promise<RestaurantRegionsResponse> {
		return withDelay(130, () => adminMockDb.getRegions());
	},

	getRegionSummaries(query?: RegionListQuery): Promise<RegionListResponse> {
		return withDelay(130, () => adminMockDb.getRegionSummaries(query));
	},

	getRegionById(id: number): Promise<RegionDetail | null> {
		return withDelay(120, () => adminMockDb.getRegionById(id));
	},

	createRegion(request: RegionCreateRequest): Promise<RegionDetail> {
		return withDelay(180, () => adminMockDb.createRegion(request));
	},

	updateRegion(id: number, patch: RegionPatchRequest): Promise<RegionDetail> {
		return withDelay(180, () => adminMockDb.updateRegion(id, patch));
	},

	deleteRegion(id: number): Promise<void> {
		return withDelay(140, () => adminMockDb.deleteRegion(id));
	},

	getRestaurants(
		query: RestaurantListQuery,
	): Promise<PageResponse<RestaurantListItem>> {
		return withDelay(170, () => adminMockDb.getRestaurants(query));
	},

	getRestaurantById(id: number): Promise<RestaurantDetail | null> {
		return withDelay(120, () => adminMockDb.getRestaurantById(id));
	},

	deleteRestaurant(id: number): Promise<void> {
		return withDelay(140, () => adminMockDb.deleteRestaurant(id));
	},

	updateRestaurant(
		id: number,
		patch: RestaurantPatchRequest,
	): Promise<RestaurantDetail> {
		return withDelay(220, () => adminMockDb.updateRestaurant(id, patch));
	},

	syncRestaurant(id: number): Promise<CreateRestaurantSyncJobResponse> {
		return withDelay(260, () => adminMockDb.syncRestaurant(id));
	},

	syncAllRestaurants(): Promise<CreateRestaurantSyncJobResponse> {
		return withDelay(420, () => adminMockDb.syncAllRestaurants());
	},

	getSyncRestaurantJob(jobId: number): Promise<GetRestaurantSyncJobResponse> {
		return withDelay(180, () => adminMockDb.getSyncRestaurantJob(jobId));
	},
};
