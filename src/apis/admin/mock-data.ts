import { CATEGORY_SEED, RESTAURANT_SEED } from "../../mocks/admin-db";
import { CategoryOption, RestaurantDetail } from "./types";

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

// Backward-compatible exports for modules that still import mock-data.ts.
// The source of truth lives in src/mocks/admin-db.ts.
export const CATEGORY_OPTIONS: CategoryOption[] = CATEGORY_SEED.map(
	(category) => ({
		...clone(category),
		name: category.mediumCategory,
	}),
);

export const RESTAURANT_FIXTURES: RestaurantDetail[] = clone(RESTAURANT_SEED);
