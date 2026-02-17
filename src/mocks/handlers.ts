import { rest } from "msw";

import {
	GatheringListQuery,
	LoginRequest,
	RestaurantPatchRequest,
	RestaurantListQuery,
} from "#/apis/admin/types";
import { adminMockDb } from "#/mocks/admin-db";
import { TIME_SLOT_CODES } from "#/shared/constants";

const DEFAULT_DELAY_MS = 220;

const toNumberOrDefault = (
	value: string | null,
	defaultValue: number,
): number => {
	if (!value) {
		return defaultValue;
	}

	const parsed = Number(value);
	return Number.isFinite(parsed) ? parsed : defaultValue;
};

const toBooleanOrDefault = (
	value: string | null,
	defaultValue: boolean,
): boolean => {
	if (!value || !value.trim()) {
		return defaultValue;
	}

	const normalized = value.trim().toLowerCase();
	return normalized === "1" || normalized === "true";
};

const parseRestaurantListQuery = (url: URL): RestaurantListQuery => {
	const page = toNumberOrDefault(url.searchParams.get("page"), 0);
	const size = toNumberOrDefault(url.searchParams.get("size"), 20);
	const keyword = url.searchParams.get("keyword") ?? undefined;
	const region = url.searchParams.get("region") ?? undefined;
	const largeCategory = url.searchParams.get("largeCategory") ?? undefined;
	const categoryIdValue = url.searchParams.get("categoryId");
	const categoryId =
		categoryIdValue !== null && categoryIdValue !== ""
			? Number(categoryIdValue)
			: undefined;

	return {
		page,
		size,
		keyword,
		region,
		largeCategory,
		categoryId: Number.isFinite(categoryId) ? categoryId : undefined,
	};
};

const parseGatheringListQuery = (url: URL): GatheringListQuery => {
	const page = toNumberOrDefault(url.searchParams.get("page"), 0);
	const size = toNumberOrDefault(url.searchParams.get("size"), 12);
	const keyword = url.searchParams.get("keyword") ?? undefined;
	const region = url.searchParams.get("region") ?? undefined;
	const rawTimeSlot = url.searchParams.get("timeSlot");
	const timeSlot =
		rawTimeSlot && TIME_SLOT_CODES.includes(rawTimeSlot as (typeof TIME_SLOT_CODES)[number])
			? (rawTimeSlot as GatheringListQuery["timeSlot"])
			: undefined;
	const includeDeleted = toBooleanOrDefault(
		url.searchParams.get("includeDeleted"),
		false,
	);

	return {
		page,
		size,
		keyword,
		region,
		timeSlot,
		includeDeleted,
	};
};

const parseResourceId = (
	rawValue: string | readonly string[] | undefined,
): number => {
	if (!rawValue) {
		return NaN;
	}

	const value = Array.isArray(rawValue) ? rawValue[0] : rawValue;
	return Number(value);
};

export const handlers = [
	rest.post("*/api/v1/admin/auth/login", async (request, response, ctx) => {
		const payload = (await request.json()) as LoginRequest;

		try {
			const session = adminMockDb.login(payload);
			return response(
				ctx.delay(DEFAULT_DELAY_MS),
				ctx.json({ data: session }),
			);
		} catch (error) {
			return response(
				ctx.delay(DEFAULT_DELAY_MS),
				ctx.status(401),
				ctx.json({
					message:
						error instanceof Error
							? error.message
							: "로그인에 실패했습니다.",
				}),
			);
		}
	}),

	rest.post("*/api/v1/admin/auth/logout", async (_request, response, ctx) => {
		return response(ctx.delay(80), ctx.status(204));
	}),

	rest.get(
		"*/api/v1/admin/sdui/categories",
		async (_request, response, ctx) => {
			return response(
				ctx.delay(120),
				ctx.json({ data: adminMockDb.getCategories() }),
			);
		},
	),

	rest.get("*/api/v1/sdui/categories", async (_request, response, ctx) => {
		return response(
			ctx.delay(120),
			ctx.json({ data: adminMockDb.getCategories() }),
		);
	}),

	rest.get(
		"*/api/v1/admin/gatherings/dashboard",
		async (_request, response, ctx) => {
			return response(
				ctx.delay(180),
				ctx.json({ data: adminMockDb.getGatheringDashboard() }),
			);
		},
	),

	rest.get("*/api/v1/admin/gatherings", async (request, response, ctx) => {
		const query = parseGatheringListQuery(request.url);
		return response(
			ctx.delay(DEFAULT_DELAY_MS),
			ctx.json({ data: adminMockDb.getGatherings(query) }),
		);
	}),

	rest.get(
		"*/api/v1/admin/gatherings/:gatheringId",
		async (request, response, ctx) => {
			const gatheringId = parseResourceId(
				request.params.gatheringId as string | undefined,
			);
			const gathering = adminMockDb.getGatheringById(gatheringId);

			if (!gathering) {
				return response(
					ctx.delay(180),
					ctx.status(404),
					ctx.json({ message: "모임 정보를 찾을 수 없습니다." }),
				);
			}

			return response(ctx.delay(180), ctx.json({ data: gathering }));
		},
	),

	rest.get("*/api/v1/admin/restaurants", async (request, response, ctx) => {
		const query = parseRestaurantListQuery(request.url);
		return response(
			ctx.delay(DEFAULT_DELAY_MS),
			ctx.json({ data: adminMockDb.getRestaurants(query) }),
		);
	}),

	rest.get(
		"*/api/v1/admin/restaurants/:restaurantId",
		async (request, response, ctx) => {
			const restaurantId = parseResourceId(
				request.params.restaurantId as string | undefined,
			);
			const restaurant = adminMockDb.getRestaurantById(restaurantId);

			if (!restaurant) {
				return response(
					ctx.delay(180),
					ctx.status(404),
					ctx.json({ message: "맛집 정보를 찾을 수 없습니다." }),
				);
			}

			return response(ctx.delay(180), ctx.json({ data: restaurant }));
		},
	),

	rest.put(
		"*/api/v1/admin/restaurants/:restaurantId",
		async (request, response, ctx) => {
			const restaurantId = parseResourceId(
				request.params.restaurantId as string | undefined,
			);
			const payload = (await request.json()) as RestaurantPatchRequest;

			try {
				const updatedRestaurant = adminMockDb.updateRestaurant(
					restaurantId,
					payload,
				);
				return response(
					ctx.delay(DEFAULT_DELAY_MS),
					ctx.json({ data: updatedRestaurant }),
				);
			} catch (error) {
				return response(
					ctx.delay(DEFAULT_DELAY_MS),
					ctx.status(404),
					ctx.json({
						message:
							error instanceof Error
								? error.message
								: "맛집 수정에 실패했습니다.",
					}),
				);
			}
		},
	),

	rest.post(
		"*/api/v1/admin/restaurants/:restaurantId/sync",
		async (request, response, ctx) => {
			const restaurantId = parseResourceId(
				request.params.restaurantId as string | undefined,
			);

			try {
				const result = adminMockDb.syncRestaurant(restaurantId);
				return response(ctx.delay(320), ctx.json({ data: result }));
			} catch (error) {
				return response(
					ctx.delay(320),
					ctx.status(404),
					ctx.json({
						message:
							error instanceof Error
								? error.message
								: "맛집 동기화에 실패했습니다.",
					}),
				);
			}
		},
	),

	rest.post(
		"*/api/v1/admin/restaurants/sync",
		async (_request, response, ctx) => {
			const result = adminMockDb.syncAllRestaurants();
			return response(ctx.delay(520), ctx.json({ data: result }));
		},
	),
];
