const TRAILING_SLASH_REGEX = /\/+$/;
const LEADING_OR_TRAILING_SLASH_REGEX = /^\/+|\/+$/g;
const TRUE_VALUE_SET = new Set(["1", "true", "yes", "on"]);
const FALSE_VALUE_SET = new Set(["0", "false", "no", "off"]);

/**
 * Required env reader with clear error messaging.
 */
export const getRequiredEnv = (name: string): string => {
	const rawValue = process.env[name];

	if (!rawValue || !rawValue.trim()) {
		throw new Error(`[env] Missing required environment variable: ${name}`);
	}

	return rawValue.trim();
};

/**
 * Optional boolean env reader.
 * - Returns fallbackValue when env is undefined/blank.
 * - Accepts: true(1,true,yes,on), false(0,false,no,off)
 */
export const getBooleanEnv = (
	name: string,
	fallbackValue: boolean,
): boolean => {
	const rawValue = process.env[name];

	if (!rawValue || !rawValue.trim()) {
		return fallbackValue;
	}

	const normalized = rawValue.trim().toLowerCase();
	if (TRUE_VALUE_SET.has(normalized)) {
		return true;
	}

	if (FALSE_VALUE_SET.has(normalized)) {
		return false;
	}

	throw new Error(
		`[env] Invalid boolean environment variable: ${name}=${rawValue}`,
	);
};

const normalizeApiUrl = (value: string): string =>
	value.replace(TRAILING_SLASH_REGEX, "");

const normalizePathPrefix = (value: string): string => {
	const trimmed = value.trim();
	if (!trimmed) {
		return "/api/v1/admin";
	}

	const normalized = trimmed.replace(LEADING_OR_TRAILING_SLASH_REGEX, "");
	return `/${normalized}`;
};

/**
 * Shared app env contract.
 * - CRA requires REACT_APP_* for client exposure.
 */
export const APP_ENV = {
	get API_URL(): string {
		return normalizeApiUrl(getRequiredEnv("REACT_APP_API_URL"));
	},
	get ADMIN_API_PREFIX(): string {
		return normalizePathPrefix(
			process.env.REACT_APP_ADMIN_API_PREFIX ?? "/api/v1/admin",
		);
	},
	get USE_MOCK_API(): boolean {
		return getBooleanEnv("REACT_APP_USE_MOCK_API", true);
	},
};
