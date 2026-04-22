import React, {
	PropsWithChildren,
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";

import { setAdminServiceMode } from "#/apis/admin";
import {
	login as loginApi,
	logout as logoutApi,
	type AdminSession,
	type LoginRequest,
} from "#/apis/auth";
import { APP_ENV } from "#/shared/config/env";

const ACCESS_TOKEN_KEY = "admin_access_token";
const REFRESH_TOKEN_KEY = "admin_refresh_token";
const SESSION_KEY = "admin_session";
const AUTH_SESSION_UPDATED_EVENT = "admin-session-updated";

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

	return true;
};

const inferAdminServiceMode = (session: AdminSession | null): "mock" | "real" => {
	const accessToken = session?.tokenBundle?.accessToken?.trim();
	if (!accessToken) {
		return APP_ENV.USE_MOCK_API ? "mock" : "real";
	}

	return accessToken.startsWith("mock-") ? "mock" : "real";
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

const readInitialSession = (): AdminSession | null => {
	const storedSession = readStoredSession();
	setAdminServiceMode(inferAdminServiceMode(storedSession));
	return storedSession;
};

export function AuthProvider({ children }: PropsWithChildren) {
	const [session, setSession] = useState<AdminSession | null>(() =>
		readInitialSession(),
	);

	useEffect(() => {
		setAdminServiceMode(inferAdminServiceMode(session));
	}, [session]);

	useEffect(() => {
		if (!isBrowser()) {
			return;
		}

		const syncSessionFromStorage = () => {
			setSession(readStoredSession());
		};

		const onStorage = (event: StorageEvent) => {
			if (
				!event.key ||
				event.key === SESSION_KEY ||
				event.key === ACCESS_TOKEN_KEY ||
				event.key === REFRESH_TOKEN_KEY
			) {
				syncSessionFromStorage();
			}
		};

		window.addEventListener("storage", onStorage);
		window.addEventListener(
			AUTH_SESSION_UPDATED_EVENT,
			syncSessionFromStorage as EventListener,
		);

		return () => {
			window.removeEventListener("storage", onStorage);
			window.removeEventListener(
				AUTH_SESSION_UPDATED_EVENT,
				syncSessionFromStorage as EventListener,
			);
		};
	}, []);

	const login = useCallback(async (request: LoginRequest) => {
		const nextSession = await loginApi(request);
		setSession(nextSession);
		persistSession(nextSession);
	}, []);

	const logout = useCallback(async () => {
		try {
			await logoutApi();
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
