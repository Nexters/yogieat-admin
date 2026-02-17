import React, {
	PropsWithChildren,
	createContext,
	useCallback,
	useContext,
	useMemo,
	useState,
} from "react";
import { AdminSession, LoginRequest, adminService } from "../apis/admin";

const ACCESS_TOKEN_KEY = "admin_access_token";
const REFRESH_TOKEN_KEY = "admin_refresh_token";
const SESSION_KEY = "admin_session";

export const AUTH_STORAGE_KEYS = {
	ACCESS_TOKEN_KEY,
	REFRESH_TOKEN_KEY,
	SESSION_KEY,
};

type AuthContextValue = {
	isAuthenticated: boolean;
	login: (request: LoginRequest) => Promise<void>;
	logout: () => Promise<void>;
	session: AdminSession | null;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const isBrowser = () => typeof window !== "undefined";

const isValidSession = (session: AdminSession): boolean => {
	const accessToken = session.tokenBundle.accessToken?.trim();
	const refreshToken = session.tokenBundle.refreshToken?.trim();
	const expiresAt = session.tokenBundle.expiresAt;

	if (!accessToken || !refreshToken || !expiresAt) {
		return false;
	}

	const expiresAtTime = new Date(expiresAt).getTime();
	if (!Number.isFinite(expiresAtTime)) {
		return false;
	}

	return expiresAtTime > Date.now();
};

const readStoredSession = (): AdminSession | null => {
	if (!isBrowser()) {
		return null;
	}

	const raw = window.localStorage.getItem(SESSION_KEY);
	if (!raw) {
		return null;
	}

	try {
		const parsed = JSON.parse(raw) as AdminSession;
		if (!isValidSession(parsed)) {
			window.localStorage.removeItem(SESSION_KEY);
			window.localStorage.removeItem(ACCESS_TOKEN_KEY);
			window.localStorage.removeItem(REFRESH_TOKEN_KEY);
			return null;
		}
		return parsed;
	} catch (error) {
		window.localStorage.removeItem(SESSION_KEY);
		window.localStorage.removeItem(ACCESS_TOKEN_KEY);
		window.localStorage.removeItem(REFRESH_TOKEN_KEY);
		return null;
	}
};

const persistSession = (session: AdminSession | null) => {
	if (!isBrowser()) {
		return;
	}

	if (!session) {
		window.localStorage.removeItem(SESSION_KEY);
		window.localStorage.removeItem(ACCESS_TOKEN_KEY);
		window.localStorage.removeItem(REFRESH_TOKEN_KEY);
		return;
	}

	window.localStorage.setItem(
		ACCESS_TOKEN_KEY,
		session.tokenBundle.accessToken,
	);
	window.localStorage.setItem(
		REFRESH_TOKEN_KEY,
		session.tokenBundle.refreshToken,
	);
	window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
};

export function AuthProvider({ children }: PropsWithChildren) {
	const [session, setSession] = useState<AdminSession | null>(() =>
		readStoredSession(),
	);

	const login = useCallback(async (request: LoginRequest) => {
		const nextSession = await adminService.login(request);
		setSession(nextSession);
		persistSession(nextSession);
	}, []);

	const logout = useCallback(async () => {
		try {
			await adminService.logout();
		} finally {
			setSession(null);
			persistSession(null);
		}
	}, []);

	const value = useMemo<AuthContextValue>(
		() => ({
			session,
			isAuthenticated: session ? isValidSession(session) : false,
			login,
			logout,
		}),
		[login, logout, session],
	);

	return (
		<AuthContext.Provider value={value}>{children}</AuthContext.Provider>
	);
}

export const useAuth = (): AuthContextValue => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within AuthProvider");
	}
	return context;
};
