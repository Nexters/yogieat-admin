describe("admin service mode selector", () => {
	const ORIGINAL_API_URL = process.env.REACT_APP_API_URL;
	const ORIGINAL_USE_MOCK_API = process.env.REACT_APP_USE_MOCK_API;

	afterEach(() => {
		jest.resetModules();

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
