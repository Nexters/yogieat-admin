import { mutationOptions } from "@tanstack/react-query";

import {
	syncAllRestaurants,
	syncRestaurant,
	updateRestaurant,
} from "#/apis/restaurants/api";
import { restaurantKeys } from "#/apis/restaurants/queryKey";
import type { RestaurantPatchRequest } from "#/apis/restaurants/type";

export const restaurantMutationOptions = {
	update: () =>
		mutationOptions({
			mutationKey: [...restaurantKeys.all, "update"] as const,
			mutationFn: ({
				id,
				patch,
			}: {
				id: number;
				patch: RestaurantPatchRequest;
			}) => updateRestaurant(id, patch),
		}),
	syncById: () =>
		mutationOptions({
			mutationKey: [...restaurantKeys.sync(), "single"] as const,
			mutationFn: (id: number) => syncRestaurant(id),
		}),
	syncAll: () =>
		mutationOptions({
			mutationKey: restaurantKeys.syncAll(),
			mutationFn: () => syncAllRestaurants(),
		}),
};
