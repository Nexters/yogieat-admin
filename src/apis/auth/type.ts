export type TokenBundle = {
	accessToken: string;
	refreshToken: string;
	tokenType?: string;
	expiresAt: string;
	accessTokenExpiresIn?: number;
	refreshTokenExpiresIn?: number;
};

export type AdminSession = {
	adminId: string;
	name: string;
	roles: string[];
	tokenBundle: TokenBundle;
};

export type LoginRequest = {
	loginId: string;
	password: string;
};

export type RefreshTokenRequest = {
	refreshToken: string;
};

export type RefreshTokenResponse = {
	accessToken: string;
	refreshToken: string;
	tokenType: string;
	accessTokenExpiresIn: number;
	refreshTokenExpiresIn: number;
};
