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
	SyncResult,
	TokenBundle,
} from "#/apis/admin/types";
import { ApiError, requestJson } from "#/shared/config";
import { APP_ENV } from "#/shared/config/env";

type ApiEnvelope<T> = T | { data: T };

type LoginPayload =
	| AdminSession
	| {
			adminId?: string;
			name?: string;
			roles?: string[];
			accessToken?: string;
			refreshToken?: string;
			expiresAt?: string;
			tokenBundle?: TokenBundle;
	  };

const ACCESS_TOKEN_KEY = "admin_access_token";
const API_V1_PREFIX = "api/v1";
const LEADING_OR_TRAILING_SLASH_REGEX = /^\/+|\/+$/g;

const unwrapData = <T>(payload: ApiEnvelope<T>): T => {
	if (
		payload &&
		typeof payload === "object" &&
		"data" in payload &&
		typeof payload.data !== "undefined"
	) {
		return payload.data;
	}

	return payload as T;
};

const getAccessToken = (): string | null => {
	if (typeof window === "undefined") {
		return null;
	}

	return window.localStorage.getItem(ACCESS_TOKEN_KEY);
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
	if ("tokenBundle" in payload && payload.tokenBundle) {
		return {
			adminId: payload.adminId ?? "admin",
			name: payload.name ?? "Admin",
			roles: payload.roles ?? ["ADMIN"],
			tokenBundle: payload.tokenBundle,
		};
	}

	if (
		"accessToken" in payload &&
		typeof payload.accessToken === "string" &&
		"refreshToken" in payload &&
		typeof payload.refreshToken === "string"
	) {
		return {
			adminId:
				typeof payload.adminId === "string" ? payload.adminId : "admin",
			name: typeof payload.name === "string" ? payload.name : "Admin",
			roles: Array.isArray(payload.roles) ? payload.roles : ["ADMIN"],
			tokenBundle: {
				accessToken: payload.accessToken,
				refreshToken: payload.refreshToken,
				expiresAt:
					typeof payload.expiresAt === "string"
						? payload.expiresAt
						: new Date(Date.now() + 1000 * 60 * 60).toISOString(),
			},
		};
	}

	throw new Error("로그인 응답 형식이 예상과 다릅니다.");
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
const getSyncByIdPath = (id: number) => toAdminPath(`restaurants/${id}/sync`);
const getGatheringByIdPath = (id: number) => toAdminPath(`gatherings/${id}`);

export const realAdminService: AdminService = {
	async login(request: LoginRequest): Promise<AdminSession> {
		const response = await requestJson<ApiEnvelope<LoginPayload>>(
			toAdminPath("auth/login"),
			{
				method: "POST",
				body: request,
			},
		);

		return normalizeSession(unwrapData(response));
	},

	async logout(): Promise<void> {
		await requestJson<void>(toAdminPath("auth/logout"), {
			method: "POST",
			headers: withAuthHeaders(),
		});
	},

	async getCategories(): Promise<CategoryOption[]> {
		const response = await requestJson<ApiEnvelope<CategoryOption[]>>(
			toAdminPath("sdui/categories"),
			{
				headers: withAuthHeaders(),
			},
		);

		return normalizeCategories(unwrapData(response));
	},

	async getGatheringDashboard(): Promise<GatheringDashboardData> {
		const response = await requestJson<ApiEnvelope<GatheringDashboardData>>(
			toAdminPath("gatherings/dashboard"),
			{
				headers: withAuthHeaders(),
			},
		);

		return unwrapData(response);
	},

	async getGatherings(
		query: GatheringListQuery,
	): Promise<PageResponse<GatheringListItem>> {
		const response = await requestJson<
			ApiEnvelope<PageResponse<GatheringListItem>>
		>(`${toAdminPath("gatherings")}?${buildGatheringListQuery(query)}`, {
			headers: withAuthHeaders(),
		});

		return unwrapData(response);
	},

	async getGatheringById(id: number): Promise<GatheringDetail | null> {
		try {
			const response = await requestJson<ApiEnvelope<GatheringDetail>>(
				getGatheringByIdPath(id),
				{
					headers: withAuthHeaders(),
				},
			);
			return unwrapData(response);
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
		const response = await requestJson<
			ApiEnvelope<PageResponse<RestaurantListItem>>
		>(`${toAdminPath("restaurants")}?${buildRestaurantListQuery(query)}`, {
			headers: withAuthHeaders(),
		});

		return unwrapData(response);
	},

	async getRestaurantById(id: number): Promise<RestaurantDetail | null> {
		try {
			const response = await requestJson<ApiEnvelope<RestaurantDetail>>(
				getByIdPath(id),
				{
					headers: withAuthHeaders(),
				},
			);
			return unwrapData(response);
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
		const response = await requestJson<ApiEnvelope<RestaurantDetail>>(
			getByIdPath(id),
			{
				method: "PUT",
				headers: withAuthHeaders(),
				body: patch,
			},
		);

		return unwrapData(response);
	},

	async syncRestaurant(id: number): Promise<SyncResult> {
		const response = await requestJson<ApiEnvelope<SyncResult>>(
			getSyncByIdPath(id),
			{
				method: "POST",
				headers: withAuthHeaders(),
			},
		);

		return unwrapData(response);
	},

	async syncAllRestaurants(): Promise<SyncResult> {
		const response = await requestJson<ApiEnvelope<SyncResult>>(
			toAdminPath("restaurants/sync"),
			{
				method: "POST",
				headers: withAuthHeaders(),
			},
		);

		return unwrapData(response);
	},
};
