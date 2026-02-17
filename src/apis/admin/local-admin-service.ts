import {
	AdminService,
	AdminSession,
	CategoryOption,
	GatheringDetail,
	GatheringDashboardData,
	GatheringListItem,
	GatheringListQuery,
	LoginRequest,
	PageResponse,
	RestaurantDetail,
	RestaurantListItem,
	RestaurantListQuery,
	RestaurantPatchRequest,
	SyncResult,
} from "#/apis/admin/types";
import { adminMockDb } from "#/mocks/admin-db";

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

	getRestaurants(
		query: RestaurantListQuery,
	): Promise<PageResponse<RestaurantListItem>> {
		return withDelay(170, () => adminMockDb.getRestaurants(query));
	},

	getRestaurantById(id: number): Promise<RestaurantDetail | null> {
		return withDelay(120, () => adminMockDb.getRestaurantById(id));
	},

	updateRestaurant(
		id: number,
		patch: RestaurantPatchRequest,
	): Promise<RestaurantDetail> {
		return withDelay(220, () => adminMockDb.updateRestaurant(id, patch));
	},

	syncRestaurant(id: number): Promise<SyncResult> {
		return withDelay(260, () => adminMockDb.syncRestaurant(id));
	},

	syncAllRestaurants(): Promise<SyncResult> {
		return withDelay(420, () => adminMockDb.syncAllRestaurants());
	},
};
