import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import {
	type PageResponse,
	type RestaurantListItem,
	type RestaurantListQuery,
} from "#/apis/restaurants";
import { useGetRestaurants, useSyncAllRestaurants } from "#/hooks";
import {
	ALL_FILTER_VALUE,
	LARGE_CATEGORY_CODES,
	REGION_CODES,
} from "#/shared/constants/DomainLabels";
import { useAutoDismissToast } from "#/shared/hooks";
import { getErrorMessage } from "#/shared/utils";

const PAGE_SIZE = 8;
const DEFAULT_REGION_OPTIONS = [ALL_FILTER_VALUE, ...REGION_CODES];
const DEFAULT_LARGE_CATEGORY_OPTIONS = [
	ALL_FILTER_VALUE,
	...LARGE_CATEGORY_CODES,
];

const DEFAULT_PAGE: PageResponse<RestaurantListItem> = {
	content: [],
	page: 0,
	size: PAGE_SIZE,
	totalElements: 0,
	totalPages: 1,
	hasNext: false,
};

const clampToPageZeroOrAbove = (value: number) =>
	Number.isInteger(value) && value >= 0 ? value : 0;

const toTrimmedValue = (value: string | null) => {
	const trimmed = value?.trim();
	return trimmed ? trimmed : undefined;
};

const toNonNegativeInteger = (value: string | null, fallback: number) => {
	const parsed = Number.parseInt(value ?? "", 10);
	return Number.isInteger(parsed) && parsed >= 0 ? parsed : fallback;
};

const toRestaurantListQuery = (searchParams: URLSearchParams): RestaurantListQuery => {
	const page = clampToPageZeroOrAbove(toNonNegativeInteger(searchParams.get("page"), 0));
	const size = Math.max(
		1,
		toNonNegativeInteger(searchParams.get("size"), PAGE_SIZE),
	);
	const keyword = toTrimmedValue(searchParams.get("keyword"));
	const region = toTrimmedValue(searchParams.get("region"));
	const largeCategory = toTrimmedValue(searchParams.get("largeCategory"));
	const rawCategoryId = searchParams.get("categoryId");
	const categoryId =
		rawCategoryId !== null && Number.isInteger(Number(rawCategoryId))
			? Number(rawCategoryId)
			: undefined;

	return {
		page,
		size,
		keyword,
		region,
		largeCategory,
		categoryId,
	};
};

const toSearchParams = (query: RestaurantListQuery) => {
	const nextSearchParams = new URLSearchParams();
	nextSearchParams.set("page", String(clampToPageZeroOrAbove(query.page)));
	nextSearchParams.set("size", String(Math.max(1, query.size)));

	if (query.keyword) {
		nextSearchParams.set("keyword", query.keyword);
	}
	if (query.region) {
		nextSearchParams.set("region", query.region);
	}
	if (query.largeCategory) {
		nextSearchParams.set("largeCategory", query.largeCategory);
	}
	if (typeof query.categoryId === "number") {
		nextSearchParams.set("categoryId", String(query.categoryId));
	}

	return nextSearchParams;
};

const isSameRestaurantListQuery = (
	left: RestaurantListQuery,
	right: RestaurantListQuery,
) =>
	left.page === right.page &&
	left.size === right.size &&
	left.keyword === right.keyword &&
	left.region === right.region &&
	left.largeCategory === right.largeCategory &&
	left.categoryId === right.categoryId;

export function useRestaurantListPage() {
	const [searchParams, setSearchParams] = useSearchParams();
	const [query, setQuery] = useState<RestaurantListQuery>(() =>
		toRestaurantListQuery(searchParams),
	);
	const [keywordInput, setKeywordInput] = useState("");
	const [pageInputText, setPageInputText] = useState("1");
	const [toastMessage, setToastMessage] = useState("");
	const [imageErrorById, setImageErrorById] = useState<Record<number, true>>(
		{},
	);

	const {
		data: pageResponse = DEFAULT_PAGE,
		error: restaurantListError,
		isLoading,
	} = useGetRestaurants(query);

	const syncAllMutation = useSyncAllRestaurants();
	const isSyncingAll = syncAllMutation.isPending;
	const errorMessage = restaurantListError
		? getErrorMessage(
				restaurantListError,
				"맛집 목록을 불러오지 못했습니다.",
			)
		: "";

	const clearToastMessage = useCallback(() => {
		setToastMessage("");
	}, []);

	const setQueryWithSync = useCallback(
		(
			nextQuery:
				| RestaurantListQuery
				| ((current: RestaurantListQuery) => RestaurantListQuery),
		) => {
			setQuery((current) => {
				const resolvedQuery =
					typeof nextQuery === "function"
						? nextQuery(current)
						: nextQuery;
				const normalizedQuery: RestaurantListQuery = {
					...resolvedQuery,
					page: clampToPageZeroOrAbove(resolvedQuery.page),
					size: Math.max(1, resolvedQuery.size),
					keyword: toTrimmedValue(resolvedQuery.keyword ?? null),
					region: toTrimmedValue(resolvedQuery.region ?? null),
					largeCategory: toTrimmedValue(
						resolvedQuery.largeCategory ?? null,
					),
				};

				const normalizedCategoryId = toNonNegativeInteger(
					resolvedQuery.categoryId?.toString() ?? null,
					-1,
				);
				if (normalizedCategoryId >= 0) {
					normalizedQuery.categoryId = normalizedCategoryId;
				} else {
					delete normalizedQuery.categoryId;
				}

				if (isSameRestaurantListQuery(current, normalizedQuery)) {
					return current;
				}

				setSearchParams(toSearchParams(normalizedQuery), { replace: true });
				return normalizedQuery;
			});
		},
		[setSearchParams],
	);

	useEffect(() => {
		const nextQuery = toRestaurantListQuery(searchParams);
		setQuery((current) =>
			isSameRestaurantListQuery(current, nextQuery) ? current : nextQuery,
		);
	}, [searchParams]);

	useEffect(() => {
		setPageInputText(String(query.page + 1));
	}, [query.page]);

	useEffect(() => {
		setImageErrorById({});
	}, [pageResponse.content]);

	useAutoDismissToast(toastMessage, clearToastMessage);

	const regionOptions = useMemo(() => {
		const optionSet = new Set<string>(DEFAULT_REGION_OPTIONS);
		if (query.region) {
			optionSet.add(query.region);
		}
		pageResponse.content.forEach((restaurant) => {
			if (restaurant.region) {
				optionSet.add(restaurant.region);
			}
		});

		return Array.from(optionSet);
	}, [pageResponse.content, query.region]);

	const largeCategoryOptions = useMemo(() => {
		const optionSet = new Set<string>(DEFAULT_LARGE_CATEGORY_OPTIONS);
		if (query.largeCategory) {
			optionSet.add(query.largeCategory);
		}
		return Array.from(optionSet);
	}, [query.largeCategory]);

	const applySearch = useCallback(() => {
		setQueryWithSync((current) => ({
			...current,
			page: 0,
			keyword: keywordInput.trim() || undefined,
		}));
	}, [keywordInput, setQueryWithSync]);

	const handleRegionChange = useCallback(
		(region: string) => {
			setQueryWithSync((current) => ({
				...current,
				page: 0,
				region: region === ALL_FILTER_VALUE ? undefined : region,
			}));
		},
		[setQueryWithSync],
	);

	const handleLargeCategoryChange = useCallback(
		(rawLargeCategory: string) => {
			setQueryWithSync((current) => ({
				...current,
				page: 0,
				largeCategory:
					rawLargeCategory === ALL_FILTER_VALUE
						? undefined
						: rawLargeCategory,
					categoryId: undefined,
			}));
		},
		[setQueryWithSync],
	);

	const handlePageMove = useCallback(
		(direction: "prev" | "next") => {
			setQueryWithSync((current) => {
				if (direction === "prev") {
					return {
						...current,
						page: Math.max(current.page - 1, 0),
					};
				}

				return {
					...current,
					page: current.page + 1,
				};
			});
		},
		[setQueryWithSync],
	);

	const handlePageInputChange = useCallback((value: string) => {
		setPageInputText(value.replace(/[^0-9]/g, ""));
	}, []);

	const handlePageSubmit = useCallback(() => {
		const nextPageInput = Number.parseInt(pageInputText, 10);
		if (Number.isNaN(nextPageInput)) {
			setPageInputText(String(query.page + 1));
			return;
		}

		const maxPage = Math.max(pageResponse.totalPages - 1, 0);
		const nextPage = Math.max(0, Math.min(nextPageInput - 1, maxPage));

		setQueryWithSync((current) => ({
			...current,
			page: nextPage,
		}));
	}, [pageInputText, pageResponse.totalPages, query.page, setQueryWithSync]);

	const handleSyncAll = useCallback(async () => {
		try {
			const result = await syncAllMutation.mutateAsync();
			setToastMessage(
				`전체 동기화 작업이 생성되었습니다. (job #${result.jobId})`,
			);
		} catch (error) {
			setToastMessage(
				getErrorMessage(error, "전체 동기화 중 오류가 발생했습니다."),
			);
		}
	}, [syncAllMutation]);

	const handleImageError = useCallback((restaurantId: number) => {
		setImageErrorById((current) => {
			if (current[restaurantId]) {
				return current;
			}
			return {
				...current,
				[restaurantId]: true,
			};
		});
	}, []);

	return {
		errorMessage,
		handleImageError,
		handleLargeCategoryChange,
		handlePageInputChange,
		handlePageMove,
		handlePageSubmit,
		handleRegionChange,
		handleSyncAll,
		imageErrorById,
		isLoading,
		isSyncingAll,
		keywordInput,
		largeCategoryOptions,
		pageInputText,
		pageResponse,
		query,
		regionOptions,
		setKeywordInput,
		toastMessage,
		applySearch,
	};
}
