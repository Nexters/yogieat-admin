import { mutationOptions } from "@tanstack/react-query";

import {
	createRestaurant,
	syncAllRestaurants,
	syncRestaurant,
	deleteRestaurant,
	updateRestaurant,
} from "#/apis/restaurants/api";
import { restaurantKeys } from "#/apis/restaurants/queryKey";
import type { RestaurantPatchRequest } from "#/apis/restaurants/type";

export const restaurantMutationOptions = {
	create: () =>
		mutationOptions({
			mutationKey: [...restaurantKeys.all, "create"] as const,
			mutationFn: createRestaurant,
		}),
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
	deleteById: () =>
		mutationOptions({
			mutationKey: [...restaurantKeys.all, "delete"] as const,
			mutationFn: (id: number) => deleteRestaurant(id),
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
