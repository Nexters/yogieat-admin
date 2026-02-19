import { CategoryOption, RestaurantDetail } from "#/apis/admin/types";
import { CATEGORY_SEED, RESTAURANT_SEED } from "#/mocks/AdminDb";

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

// This module now exposes admin mock fixtures from src/mocks/AdminDb.ts.
export const CATEGORY_OPTIONS: CategoryOption[] = CATEGORY_SEED.map(
	(category) => ({
		...clone(category),
		name: category.mediumCategory,
	}),
);

export const RESTAURANT_FIXTURES: RestaurantDetail[] = clone(RESTAURANT_SEED);
