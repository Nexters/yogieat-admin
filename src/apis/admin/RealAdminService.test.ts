import { rest } from "msw";

import { realAdminService } from "#/apis/admin/RealAdminService";
import type { RestaurantListItem } from "#/apis/restaurants";
import { server } from "#/mocks/server";
import { ADMIN_ERROR_CODE } from "#/shared/constants";

const ACCESS_TOKEN_KEY = "admin_access_token";
const REFRESH_TOKEN_KEY = "admin_refresh_token";
const SESSION_KEY = "admin_session";
const SESSION_UPDATED_EVENT = "admin-session-updated";

const createErrorResponse = (errorCode: string, message: string) => ({
	status: 401,
	data: {
		errorCode,
		message,
	},
	timestamp: new Date().toISOString(),
});

const createRestaurantListItem = (
	id: number,
	updatedAt: string,
): RestaurantListItem => ({
	id,
	name: `맛집 ${id}`,
	categoryId: null,
	rating: null,
	imageUrl: null,
	region: "GANGNAM",
	isDisplay: true,
	updatedAt,
});

const seedStoredSession = () => {
	window.localStorage.setItem(ACCESS_TOKEN_KEY, "real-access-token");
	window.localStorage.setItem(REFRESH_TOKEN_KEY, "real-refresh-token");
	window.localStorage.setItem(
		SESSION_KEY,
		JSON.stringify({
			adminId: "admin-1",
			name: "Yogieat Admin",
			roles: ["ADMIN"],
			tokenBundle: {
				accessToken: "real-access-token",
				refreshToken: "real-refresh-token",
				expiresAt: "2099-01-01T00:00:00.000Z",
			},
		}),
	);
};

describe("real admin service auth handling", () => {
	beforeEach(() => {
		window.localStorage.clear();
	});

	test("clears stored session and notifies app on unauthorized response", async () => {
		seedStoredSession();
		const onSessionUpdated = jest.fn();
		window.addEventListener(SESSION_UPDATED_EVENT, onSessionUpdated);

		server.use(
			rest.get(
				"*/api/v1/admin/categories",
				(_request, response, ctx) => {
					return response(
						ctx.status(401),
						ctx.json(
							createErrorResponse(
								ADMIN_ERROR_CODE.UNAUTHORIZED,
								"인증이 필요합니다.",
							),
						),
					);
				},
			),
		);

		try {
			await expect(realAdminService.getCategories()).rejects.toMatchObject({
				status: 401,
			});

			expect(window.localStorage.getItem(ACCESS_TOKEN_KEY)).toBeNull();
			expect(window.localStorage.getItem(REFRESH_TOKEN_KEY)).toBeNull();
			expect(window.localStorage.getItem(SESSION_KEY)).toBeNull();
			expect(onSessionUpdated).toHaveBeenCalledTimes(1);
		} finally {
			window.removeEventListener(SESSION_UPDATED_EVENT, onSessionUpdated);
		}
	});

	test("requests and normalizes restaurant list order by updatedAt and id descending", async () => {
		seedStoredSession();
		let requestedSorts: string[] = [];

		server.use(
			rest.get(
				"*/api/v1/admin/restaurants",
				(request, response, ctx) => {
					requestedSorts = request.url.searchParams.getAll("sort");

					return response(
						ctx.json({
							status: 200,
							data: {
								content: [
									createRestaurantListItem(
										1,
										"2026-05-20T00:00:00.000Z",
									),
									createRestaurantListItem(
										3,
										"2026-05-21T00:00:00.000Z",
									),
									createRestaurantListItem(
										2,
										"2026-05-20T00:00:00.000Z",
									),
								],
								page: 0,
								size: 10,
								totalElements: 3,
								totalPages: 1,
								hasNext: false,
							},
							timestamp: new Date().toISOString(),
						}),
					);
				},
			),
		);

		const response = await realAdminService.getRestaurants({
			page: 0,
			size: 10,
			region: "GANGNAM",
		});

		expect(requestedSorts).toEqual(["updatedAt,desc", "id,desc"]);
		expect(response.content.map((restaurant) => restaurant.id)).toEqual([
			3,
			2,
			1,
		]);
	});
});

export {};
