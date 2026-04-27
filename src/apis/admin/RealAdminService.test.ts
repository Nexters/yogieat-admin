import { rest } from "msw";

import { realAdminService } from "#/apis/admin/RealAdminService";
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
});

export {};
