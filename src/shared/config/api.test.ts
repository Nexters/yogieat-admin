describe("api config", () => {
	const ORIGINAL_API_URL = process.env.REACT_APP_API_URL;

	afterEach(() => {
		jest.resetModules();

		if (typeof ORIGINAL_API_URL === "undefined") {
			delete process.env.REACT_APP_API_URL;
			return;
		}

		process.env.REACT_APP_API_URL = ORIGINAL_API_URL;
	});

	test("builds API_BASE_URL with /api/v1", () => {
		process.env.REACT_APP_API_URL = "https://dev-api.yogieat.com";
		const { API_BASE_URL } = require("./api");

		expect(API_BASE_URL).toBe("https://dev-api.yogieat.com/api/v1");
	});

	test("normalizes duplicate slash when env ends with slash", () => {
		process.env.REACT_APP_API_URL = "https://dev-api.yogieat.com/";
		const { API_BASE_URL } = require("./api");

		expect(API_BASE_URL).toBe("https://dev-api.yogieat.com/api/v1");
	});

	test("buildApiUrl appends endpoint without duplicate slash", () => {
		process.env.REACT_APP_API_URL = "https://dev-api.yogieat.com/";
		const { buildApiUrl } = require("./api");

		expect(buildApiUrl("/gatherings/test")).toBe(
			"https://dev-api.yogieat.com/api/v1/gatherings/test",
		);
		expect(buildApiUrl("")).toBe("https://dev-api.yogieat.com/api/v1");
	});
});

export {};
