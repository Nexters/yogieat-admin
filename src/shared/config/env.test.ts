import { APP_ENV, getRequiredEnv } from "./env";

describe("env config", () => {
	const ORIGINAL_API_URL = process.env.REACT_APP_API_URL;

	afterEach(() => {
		if (typeof ORIGINAL_API_URL === "undefined") {
			delete process.env.REACT_APP_API_URL;
			return;
		}

		process.env.REACT_APP_API_URL = ORIGINAL_API_URL;
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
});
