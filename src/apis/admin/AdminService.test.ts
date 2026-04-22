describe("admin service mode selector", () => {
	const ORIGINAL_API_URL = process.env.REACT_APP_API_URL;
	const ORIGINAL_USE_MOCK_API = process.env.REACT_APP_USE_MOCK_API;
	const ACCESS_TOKEN_KEY = "admin_access_token";
	const REFRESH_TOKEN_KEY = "admin_refresh_token";
	const SESSION_KEY = "admin_session";

	afterEach(() => {
		jest.resetModules();
		window.localStorage.clear();

		if (typeof ORIGINAL_API_URL === "undefined") {
			delete process.env.REACT_APP_API_URL;
		} else {
			process.env.REACT_APP_API_URL = ORIGINAL_API_URL;
		}

		if (typeof ORIGINAL_USE_MOCK_API === "undefined") {
			delete process.env.REACT_APP_USE_MOCK_API;
		} else {
			process.env.REACT_APP_USE_MOCK_API = ORIGINAL_USE_MOCK_API;
		}
	});

	test("uses mock mode by default", () => {
		process.env.REACT_APP_API_URL = "https://dev-api.yogieat.com";
		delete process.env.REACT_APP_USE_MOCK_API;

		const { ADMIN_API_MODE } = require("#/apis/admin/AdminService");
		expect(ADMIN_API_MODE).toBe("mock");
	});

	test("prefers stored real session over mock env default on startup", () => {
		process.env.REACT_APP_API_URL = "https://dev-api.yogieat.com";
		process.env.REACT_APP_USE_MOCK_API = "true";

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

		const {
			ADMIN_API_MODE,
			getAdminServiceMode,
		} = require("#/apis/admin/AdminService");
		expect(ADMIN_API_MODE).toBe("mock");
		expect(getAdminServiceMode()).toBe("real");
	});

	test("uses real mode when REACT_APP_USE_MOCK_API=false", () => {
		process.env.REACT_APP_API_URL = "https://dev-api.yogieat.com";
		process.env.REACT_APP_USE_MOCK_API = "false";

		const { ADMIN_API_MODE } = require("#/apis/admin/AdminService");
		expect(ADMIN_API_MODE).toBe("real");
	});

	test("can initialize mock mode without REACT_APP_API_URL", () => {
		delete process.env.REACT_APP_API_URL;
		process.env.REACT_APP_USE_MOCK_API = "true";

		const {
			ADMIN_API_MODE,
			adminService,
		} = require("#/apis/admin/AdminService");
		expect(ADMIN_API_MODE).toBe("mock");
		expect(typeof adminService.login).toBe("function");
	});
});

export {};
