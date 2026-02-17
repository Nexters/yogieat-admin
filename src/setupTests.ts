// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";
import { TransformStream } from "stream/web";
import { TextDecoder, TextEncoder } from "util";

if (typeof global.TextEncoder === "undefined") {
	global.TextEncoder = TextEncoder as unknown as typeof global.TextEncoder;
}

if (typeof global.TextDecoder === "undefined") {
	global.TextDecoder = TextDecoder as unknown as typeof global.TextDecoder;
}

if (typeof global.TransformStream === "undefined") {
	global.TransformStream =
		TransformStream as unknown as typeof global.TransformStream;
}

process.env.REACT_APP_API_URL =
	process.env.REACT_APP_API_URL ?? "https://dev-api.yogieat.com";
process.env.REACT_APP_USE_MOCK_API =
	process.env.REACT_APP_USE_MOCK_API ?? "true";

const { resetAdminMockData } = require("#/mocks/admin-db");
const { server } = require("#/mocks/server");

beforeAll(() => {
	server.listen({ onUnhandledRequest: "bypass" });
});

afterEach(() => {
	server.resetHandlers();
	resetAdminMockData();
});

afterAll(() => {
	server.close();
});
