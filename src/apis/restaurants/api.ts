import { adminService } from "#/apis/admin";
import type {
	CategoryOption,
	PageResponse,
	RestaurantDetail,
	RestaurantListItem,
	RestaurantListQuery,
	RestaurantPatchRequest,
	CreateRestaurantSyncJobResponse,
	GetRestaurantSyncJobResponse,
} from "#/apis/restaurants/type";

export const getCategories = (): Promise<CategoryOption[]> => {
	return adminService.getCategories();
};

export const getRestaurants = (
	query: RestaurantListQuery,
): Promise<PageResponse<RestaurantListItem>> => {
	return adminService.getRestaurants(query);
};

export const getRestaurantById = (
	id: number,
): Promise<RestaurantDetail | null> => {
	return adminService.getRestaurantById(id);
};

export const updateRestaurant = (
	id: number,
	patch: RestaurantPatchRequest,
): Promise<RestaurantDetail> => {
	return adminService.updateRestaurant(id, patch);
};

export const syncRestaurant = (
	id: number,
): Promise<CreateRestaurantSyncJobResponse> => {
	return adminService.syncRestaurant(id);
};

export const syncAllRestaurants = (): Promise<CreateRestaurantSyncJobResponse> => {
	return adminService.syncAllRestaurants();
};

export const getSyncRestaurantJob = (
	jobId: number,
): Promise<GetRestaurantSyncJobResponse> => {
	return adminService.getSyncRestaurantJob(jobId);
};
