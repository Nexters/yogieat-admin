import { APP_ENV, getBooleanEnv, getRequiredEnv } from "#/shared/config/env";

describe("env config", () => {
	const ORIGINAL_API_URL = process.env.REACT_APP_API_URL;
	const ORIGINAL_ADMIN_API_PREFIX = process.env.REACT_APP_ADMIN_API_PREFIX;
	const ORIGINAL_USE_MOCK_API = process.env.REACT_APP_USE_MOCK_API;

	afterEach(() => {
		if (typeof ORIGINAL_API_URL === "undefined") {
			delete process.env.REACT_APP_API_URL;
		} else {
			process.env.REACT_APP_API_URL = ORIGINAL_API_URL;
		}

		if (typeof ORIGINAL_ADMIN_API_PREFIX === "undefined") {
			delete process.env.REACT_APP_ADMIN_API_PREFIX;
		} else {
			process.env.REACT_APP_ADMIN_API_PREFIX = ORIGINAL_ADMIN_API_PREFIX;
		}

		if (typeof ORIGINAL_USE_MOCK_API === "undefined") {
			delete process.env.REACT_APP_USE_MOCK_API;
		} else {
			process.env.REACT_APP_USE_MOCK_API = ORIGINAL_USE_MOCK_API;
		}
	});

	test("getRequiredEnv returns trimmed value", () => {
		process.env.REACT_APP_API_URL = "  https://dev-api.yogieat.com  ";

		expect(getRequiredEnv("REACT_APP_API_URL")).toBe(
			"https://dev-api.yogieat.com",
		);
	});

	test("getRequiredEnv throws when missing", () => {
		delete process.env.REACT_APP_API_URL;

		expect(() => getRequiredEnv("REACT_APP_API_URL")).toThrow(
			"[env] Missing required environment variable: REACT_APP_API_URL",
		);
	});

	test("APP_ENV.API_URL removes trailing slash", () => {
		process.env.REACT_APP_API_URL = "https://dev-api.yogieat.com/";

		expect(APP_ENV.API_URL).toBe("https://dev-api.yogieat.com");
	});

	test("getBooleanEnv returns fallback when env is missing", () => {
		delete process.env.REACT_APP_USE_MOCK_API;

		expect(getBooleanEnv("REACT_APP_USE_MOCK_API", true)).toBe(true);
		expect(getBooleanEnv("REACT_APP_USE_MOCK_API", false)).toBe(false);
	});

	test("getBooleanEnv parses false-like string", () => {
		process.env.REACT_APP_USE_MOCK_API = "false";

		expect(getBooleanEnv("REACT_APP_USE_MOCK_API", true)).toBe(false);
		expect(APP_ENV.USE_MOCK_API).toBe(false);
	});

	test("getBooleanEnv throws for invalid value", () => {
		process.env.REACT_APP_USE_MOCK_API = "invalid";

		expect(() => getBooleanEnv("REACT_APP_USE_MOCK_API", true)).toThrow(
			"[env] Invalid boolean environment variable: REACT_APP_USE_MOCK_API=invalid",
		);
	});

	test("APP_ENV.ADMIN_API_PREFIX uses default value", () => {
		delete process.env.REACT_APP_ADMIN_API_PREFIX;
		expect(APP_ENV.ADMIN_API_PREFIX).toBe("/api/v1/admin");
	});

	test("APP_ENV.ADMIN_API_PREFIX normalizes slash format", () => {
		process.env.REACT_APP_ADMIN_API_PREFIX = "api/v1/admin/";
		expect(APP_ENV.ADMIN_API_PREFIX).toBe("/api/v1/admin");
	});
});
