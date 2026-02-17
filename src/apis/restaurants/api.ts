import { adminService } from "#/apis/admin";
import type {
	CategoryOption,
	PageResponse,
	RestaurantDetail,
	RestaurantListItem,
	RestaurantListQuery,
	RestaurantPatchRequest,
	SyncResult,
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

export const syncRestaurant = (id: number): Promise<SyncResult> => {
	return adminService.syncRestaurant(id);
};

export const syncAllRestaurants = (): Promise<SyncResult> => {
	return adminService.syncAllRestaurants();
};
