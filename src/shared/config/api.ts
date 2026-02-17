import { APP_ENV } from "#/shared/config/env";

const LEADING_OR_TRAILING_SLASH_REGEX = /^\/+|\/+$/g;
const API_VERSION_PATH = "api/v1";

const trimPathSlashes = (path: string): string =>
	path.replace(LEADING_OR_TRAILING_SLASH_REGEX, "");

const joinUrl = (baseUrl: string, path: string): string => {
	const normalizedBase = baseUrl.replace(/\/+$/g, "");
	const normalizedPath = trimPathSlashes(path);

	return normalizedPath
		? `${normalizedBase}/${normalizedPath}`
		: normalizedBase;
};

/**
 * yogieat convention: <API_URL>/api/v1
 */
export const API_BASE_URL = joinUrl(APP_ENV.API_URL, API_VERSION_PATH);
export const APP_API_MODE = APP_ENV.USE_MOCK_API ? "mock" : "real";

/**
 * Build endpoint URL from API base.
 */
export const buildApiUrl = (path = ""): string => joinUrl(API_BASE_URL, path);
