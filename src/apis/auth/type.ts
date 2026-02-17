export type TokenBundle = {
	accessToken: string;
	refreshToken: string;
	expiresAt: string;
};

export type AdminSession = {
	adminId: string;
	name: string;
	roles: string[];
	tokenBundle: TokenBundle;
};

export type LoginRequest = {
	userId: string;
	password: string;
};
