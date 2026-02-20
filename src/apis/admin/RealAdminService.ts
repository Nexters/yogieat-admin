import {
	AdminService,
	AdminSession,
	CategoryOption,
	GatheringDetail,
	GatheringDashboardData,
	GatheringListItem,
	GatheringListQuery,
	LoginRequest,
	PageResponse,
	RestaurantDetail,
	RestaurantListItem,
	RestaurantListQuery,
	RestaurantPatchRequest,
	CreateRestaurantSyncJobResponse,
	GetRestaurantSyncJobResponse,
	TokenBundle,
} from "#/apis/admin/types";
import { ApiError, requestJson } from "#/shared/config";
import { APP_ENV } from "#/shared/config/env";
import { ADMIN_ERROR_CODE } from "#/shared/constants";

type RequestJsonOptions = Omit<RequestInit, "body" | "method" | "headers"> & {
	body?: unknown;
	headers?: Record<string, string>;
	method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
};

type LoginPayload =
	Record<string, unknown>;

type RawTokenResponse = {
	accessToken?: unknown;
	refreshToken?: unknown;
	expiresAt?: unknown;
	accessTokenExpiresIn?: unknown;
	refreshTokenExpiresIn?: unknown;
	tokenType?: unknown;
	tokenBundle?: unknown;
	adminId?: unknown;
	name?: unknown;
	roles?: unknown;
};

const ACCESS_TOKEN_KEY = "admin_access_token";
const REFRESH_TOKEN_KEY = "admin_refresh_token";
const SESSION_KEY = "admin_session";
const API_V1_PREFIX = "api/v1";
const LEADING_OR_TRAILING_SLASH_REGEX = /^\/+|\/+$/g;
const REFRESH_ERROR_CODE = ADMIN_ERROR_CODE.TOKEN_EXPIRED;
const SESSION_UPDATED_EVENT = "admin-session-updated";

const isBrowser = () => typeof window !== "undefined";

const readStorageSession = (): AdminSession | null => {
	if (!isBrowser()) {
		return null;
	}

	const raw = window.localStorage.getItem(SESSION_KEY);
	if (!raw) {
		return null;
	}

	try {
		return JSON.parse(raw) as AdminSession;
	} catch {
		return null;
	}
};

const toTrimmedString = (value: unknown): string | undefined => {
	if (typeof value === "string") {
		const trimmed = value.trim();
		return trimmed.length > 0 ? trimmed : undefined;
	}
	return undefined;
};

const toIsoDateString = (value: unknown): string | undefined => {
	if (typeof value === "number") {
		return Number.isFinite(value) ? new Date(value).toISOString() : undefined;
	}

	if (typeof value === "string") {
		const trimmed = value.trim();
		if (!trimmed) {
			return undefined;
		}

		const numericValue = Number(trimmed);
		if (Number.isFinite(numericValue)) {
			return new Date(numericValue).toISOString();
		}

		const parsedDate = Date.parse(trimmed);
		return Number.isNaN(parsedDate) ? undefined : new Date(parsedDate).toISOString();
	}

	return undefined;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
	typeof value === "object" && value !== null && !Array.isArray(value);

const toPositiveFiniteNumber = (value: unknown): number | undefined => {
	if (typeof value === "number") {
		return Number.isFinite(value) && value > 0 ? value : undefined;
	}

	if (typeof value === "string") {
		const trimmed = value.trim();
		if (!trimmed) {
			return undefined;
		}

		const parsed = Number(trimmed);
		return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
	}

	return undefined;
};

const resolveExpiresAt = (
	payload: RawTokenResponse,
): string | undefined => {
	const directExpiresAt = toIsoDateString(payload.expiresAt);
	if (directExpiresAt) {
		return directExpiresAt;
	}

	const accessTokenExpiresIn = toPositiveFiniteNumber(
		payload.accessTokenExpiresIn,
	);
	if (typeof accessTokenExpiresIn === "number") {
		return new Date(Date.now() + accessTokenExpiresIn).toISOString();
	}

	const refreshTokenExpiresIn = toPositiveFiniteNumber(
		payload.refreshTokenExpiresIn,
	);
	if (typeof refreshTokenExpiresIn === "number") {
		return new Date(Date.now() + refreshTokenExpiresIn).toISOString();
	}

	return undefined;
};

const normalizeTokenBundle = (payload: {
	accessToken?: unknown;
	refreshToken?: unknown;
	expiresAt?: unknown;
	accessTokenExpiresIn?: unknown;
	refreshTokenExpiresIn?: unknown;
	tokenType?: unknown;
}): TokenBundle => {
	const accessToken = toTrimmedString(payload.accessToken);
	const refreshToken = toTrimmedString(payload.refreshToken);
	const tokenType = toTrimmedString(payload.tokenType);
	const accessTokenExpiresIn = toPositiveFiniteNumber(
		payload.accessTokenExpiresIn,
	);
	const refreshTokenExpiresIn = toPositiveFiniteNumber(
		payload.refreshTokenExpiresIn,
	);
	const expiresAt = resolveExpiresAt({
		expiresAt: payload.expiresAt,
		accessTokenExpiresIn,
		refreshTokenExpiresIn,
	});

	if (!accessToken || !refreshToken || !expiresAt) {
		throw new Error("토큰 응답 형식이 예상과 다릅니다.");
	}

	return {
		accessToken,
		refreshToken,
		expiresAt,
		tokenType,
		accessTokenExpiresIn,
		refreshTokenExpiresIn,
	};
};

const extractTokenBundle = (
	payload: Record<string, unknown>,
): TokenBundle => {
	if ("tokenBundle" in payload && isRecord(payload.tokenBundle)) {
		return normalizeTokenBundle(payload.tokenBundle as RawTokenResponse);
	}

	return normalizeTokenBundle(payload as RawTokenResponse);
};

const persistTokenBundle = (tokenBundle: TokenBundle): void => {
	if (!isBrowser()) {
		return;
	}

	const session = readStorageSession() ?? {
		adminId: "admin",
		name: "Admin",
		roles: ["ADMIN"],
		tokenBundle,
	};
	const nextSession: AdminSession = {
		...session,
		tokenBundle,
	};

	window.localStorage.setItem(ACCESS_TOKEN_KEY, tokenBundle.accessToken);
	window.localStorage.setItem(REFRESH_TOKEN_KEY, tokenBundle.refreshToken);
	window.localStorage.setItem(SESSION_KEY, JSON.stringify(nextSession));
	window.dispatchEvent(new Event(SESSION_UPDATED_EVENT));
};

const clearStoredSession = (): void => {
	if (!isBrowser()) {
		return;
	}

	window.localStorage.removeItem(SESSION_KEY);
	window.localStorage.removeItem(ACCESS_TOKEN_KEY);
	window.localStorage.removeItem(REFRESH_TOKEN_KEY);
	window.dispatchEvent(new Event(SESSION_UPDATED_EVENT));
};

const getAccessToken = (): string | null => {
	if (!isBrowser()) {
		return null;
	}

	return window.localStorage.getItem(ACCESS_TOKEN_KEY);
};

const getRefreshToken = (): string | null => {
	if (!isBrowser()) {
		return null;
	}

	return window.localStorage.getItem(REFRESH_TOKEN_KEY);
};

const withAuthHeaders = (headers: Record<string, string> = {}) => {
	const accessToken = getAccessToken();
	if (!accessToken) {
		return headers;
	}

	return {
		...headers,
		Authorization: `Bearer ${accessToken}`,
	};
};

const refreshAccessToken = async (): Promise<void> => {
	const refreshToken = getRefreshToken();
	if (!refreshToken) {
		clearStoredSession();
		throw new Error("리프레시 토큰이 없습니다.");
	}

	const response = await requestJson<LoginPayload>(
		toAdminPath("auth/refresh"),
		{
			method: "POST",
			body: { refreshToken },
		},
	);

	const payload = response;
	if (typeof payload !== "object" || payload === null || Array.isArray(payload)) {
		clearStoredSession();
		throw new Error("토큰 갱신 응답 형식이 예상과 다릅니다.");
	}

	const tokenBundle = extractTokenBundle(payload as Record<string, unknown>);
	persistTokenBundle(tokenBundle);
};

const requestWithAutoRefresh = async <T>(
	path: string,
	options: RequestJsonOptions = {},
): Promise<T> => {
	try {
		return await requestJson<T>(path, {
			...options,
			headers: withAuthHeaders(options.headers),
		});
	} catch (error) {
		if (
			error instanceof ApiError &&
			error.status === 401 &&
			error.code === REFRESH_ERROR_CODE
		) {
			try {
				await refreshAccessToken();
			} catch (refreshError) {
				if (refreshError instanceof ApiError) {
					clearStoredSession();
				}
				throw refreshError;
			}

			return requestJson<T>(path, {
				...options,
				headers: withAuthHeaders(options.headers),
			});
		}

		throw error;
	}
};

const trimPathSlashes = (value: string): string =>
	value.replace(LEADING_OR_TRAILING_SLASH_REGEX, "");

const toRelativeApiPath = (prefix: string): string => {
	const normalized = trimPathSlashes(prefix);
	if (normalized === API_V1_PREFIX) {
		return "";
	}
	if (normalized.startsWith(`${API_V1_PREFIX}/`)) {
		return normalized.slice(API_V1_PREFIX.length + 1);
	}
	return normalized;
};

const ADMIN_PREFIX = toRelativeApiPath(APP_ENV.ADMIN_API_PREFIX);

const toAdminPath = (path: string): string => {
	const normalizedPath = trimPathSlashes(path);
	if (!ADMIN_PREFIX) {
		return normalizedPath;
	}
	return `${ADMIN_PREFIX}/${normalizedPath}`;
};

const buildRestaurantListQuery = (query: RestaurantListQuery): string => {
	const search = new URLSearchParams();
	search.set("page", String(query.page));
	search.set("size", String(query.size));

	if (query.keyword?.trim()) {
		search.set("keyword", query.keyword.trim());
	}
	if (query.region?.trim()) {
		search.set("region", query.region.trim());
	}
	if (query.largeCategory?.trim()) {
		search.set("largeCategory", query.largeCategory.trim());
	}
	if (typeof query.categoryId === "number") {
		search.set("categoryId", String(query.categoryId));
	}

	return search.toString();
};

const buildGatheringListQuery = (query: GatheringListQuery): string => {
	const search = new URLSearchParams();
	search.set("page", String(query.page));
	search.set("size", String(query.size));

	if (query.keyword?.trim()) {
		search.set("keyword", query.keyword.trim());
	}
	if (query.region?.trim()) {
		search.set("region", query.region.trim());
	}
	if (query.timeSlot?.trim()) {
		search.set("timeSlot", query.timeSlot.trim());
	}
	if (typeof query.includeDeleted === "boolean") {
		search.set("includeDeleted", String(query.includeDeleted));
	}

	return search.toString();
};

const normalizeSession = (payload: LoginPayload): AdminSession => {
	const tokenPayload = payload as RawTokenResponse;
	const tokenBundle = extractTokenBundle(tokenPayload as Record<string, unknown>);
	const rolesValue = tokenPayload.roles;
	const roles = Array.isArray(rolesValue)
		? rolesValue.filter((value): value is string => typeof value === "string")
		: undefined;

	return {
		adminId:
			typeof tokenPayload.adminId === "string"
				? tokenPayload.adminId
				: "admin",
		name:
			typeof tokenPayload.name === "string"
				? tokenPayload.name
				: "Admin",
		roles: roles && roles.length > 0 ? roles : ["ADMIN"],
		tokenBundle,
	};
};

const normalizeCategories = (
	categories: CategoryOption[],
): CategoryOption[] => {
	return categories.map((category) => {
		const mediumCategory =
			typeof category.mediumCategory === "string"
				? category.mediumCategory
				: category.name;
		const name =
			typeof category.name === "string" && category.name.trim()
				? category.name
				: mediumCategory;

		return {
			...category,
			name,
			mediumCategory,
			largeCategory: category.largeCategory,
		};
	});
};

const getByIdPath = (id: number) => toAdminPath(`restaurants/${id}`);
const getGatheringByIdPath = (id: number) => toAdminPath(`gatherings/${id}`);
const getRestaurantSyncJobPath = (jobId: number) =>
	`restaurants/sync-jobs/${jobId}`;
const getRestaurantSyncSinglePath = (restaurantId: number) =>
	`restaurants/${restaurantId}/sync-jobs`;

export const realAdminService: AdminService = {
	async login(request: LoginRequest): Promise<AdminSession> {
		const response = await requestJson<LoginPayload>(
			toAdminPath("auth/login"),
			{
				method: "POST",
				body: request,
			},
		);

		return normalizeSession(response);
	},

	async logout(): Promise<void> {
		await requestWithAutoRefresh<void>(toAdminPath("auth/logout"), {
			method: "POST",
		});
	},

	async getCategories(): Promise<CategoryOption[]> {
		const response = await requestWithAutoRefresh<CategoryOption[]>(
			toAdminPath("sdui/categories"),
			{},
		);

		return normalizeCategories(response);
	},

	async getGatheringDashboard(): Promise<GatheringDashboardData> {
		const response = await requestWithAutoRefresh<GatheringDashboardData>(
			toAdminPath("gatherings/dashboard"),
			{},
		);

		return response;
	},

	async getGatherings(
		query: GatheringListQuery,
	): Promise<PageResponse<GatheringListItem>> {
		const response = await requestWithAutoRefresh<
			PageResponse<GatheringListItem>
		>(`${toAdminPath("gatherings")}?${buildGatheringListQuery(query)}`, {
			headers: {},
		});

		return response;
	},

	async getGatheringById(id: number): Promise<GatheringDetail | null> {
		try {
			const response = await requestWithAutoRefresh<GatheringDetail>(
				getGatheringByIdPath(id),
				{},
			);
			return response;
		} catch (error) {
			if (error instanceof ApiError && error.status === 404) {
				return null;
			}
			throw error;
		}
	},

	async getRestaurants(
		query: RestaurantListQuery,
	): Promise<PageResponse<RestaurantListItem>> {
		const response = await requestWithAutoRefresh<
			PageResponse<RestaurantListItem>
		>(`${toAdminPath("restaurants")}?${buildRestaurantListQuery(query)}`, {
			headers: {},
		});

		return response;
	},

	async getRestaurantById(id: number): Promise<RestaurantDetail | null> {
		try {
			const response = await requestWithAutoRefresh<RestaurantDetail>(
				getByIdPath(id),
				{},
			);
			return response;
		} catch (error) {
			if (error instanceof ApiError && error.status === 404) {
				return null;
			}
			throw error;
		}
	},

	async updateRestaurant(
		id: number,
		patch: RestaurantPatchRequest,
	): Promise<RestaurantDetail> {
		const response = await requestWithAutoRefresh<RestaurantDetail>(
			getByIdPath(id),
			{
				method: "PATCH",
				body: patch,
			},
		);

		return response;
	},

	async syncRestaurant(id: number): Promise<CreateRestaurantSyncJobResponse> {
		const response = await requestWithAutoRefresh<CreateRestaurantSyncJobResponse>(
			getRestaurantSyncSinglePath(id),
			{
				method: "POST",
			},
		);

		return response;
	},

	async syncAllRestaurants(): Promise<CreateRestaurantSyncJobResponse> {
		const response = await requestWithAutoRefresh<CreateRestaurantSyncJobResponse>(
			"restaurants/sync-jobs/all",
			{
				method: "POST",
			},
		);

		return response;
	},

	async getSyncRestaurantJob(
		jobId: number,
	): Promise<GetRestaurantSyncJobResponse> {
		const response = await requestWithAutoRefresh<GetRestaurantSyncJobResponse>(
			getRestaurantSyncJobPath(jobId),
			{
				method: "GET",
			},
		);

		return response;
	},
};
