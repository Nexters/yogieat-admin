const TRAILING_SLASH_REGEX = /\/+$/;

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

const normalizeApiUrl = (value: string): string =>
	value.replace(TRAILING_SLASH_REGEX, "");

/**
 * Shared app env contract.
 * - CRA requires REACT_APP_* for client exposure.
 */
export const APP_ENV = {
	get API_URL(): string {
		return normalizeApiUrl(getRequiredEnv("REACT_APP_API_URL"));
	},
};
