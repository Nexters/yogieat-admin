export const AUTH_ENDPOINT_CONTRACTS = {
	login: {
		method: "POST",
		path: "/auth/login",
		request: "LoginRequest",
		response: "AdminSession",
	},
	logout: {
		method: "POST",
		path: "/auth/logout",
		request: "none",
		response: "void",
	},
	refresh: {
		method: "POST",
		path: "/auth/refresh",
		request: "RefreshTokenRequest",
		response: "RefreshTokenResponse",
	},
} as const;
