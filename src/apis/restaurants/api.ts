import { adminService } from "#/apis/admin";
import type {
	RestaurantCreateRequest,
	RestaurantCreateResponse,
	CategoryOption,
	PageResponse,
	RestaurantDetail,
	RestaurantRegionsResponse,
	RestaurantSearchResponse,
	RestaurantListItem,
	RestaurantListQuery,
	RestaurantPatchRequest,
	CreateRestaurantSyncJobResponse,
	GetRestaurantSyncJobResponse,
} from "#/apis/restaurants/type";

export const getCategories = (): Promise<CategoryOption[]> => {
	return adminService.getCategories();
};

export const searchRestaurants = (
	keyword: string,
): Promise<RestaurantSearchResponse> => {
	return adminService.searchRestaurants(keyword);
};

export const createRestaurant = (
	request: RestaurantCreateRequest,
): Promise<RestaurantCreateResponse> => {
	return adminService.createRestaurant(request);
};

export const getRegions = (): Promise<RestaurantRegionsResponse> => {
	return adminService.getRegions();
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

export const deleteRestaurant = (id: number): Promise<void> => {
	return adminService.deleteRestaurant(id);
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
