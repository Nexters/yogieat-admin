import { useCallback, useEffect, useMemo, useState } from "react";

import {
	type CategoryOption,
	type PageResponse,
	type RestaurantListItem,
	type RestaurantListQuery,
} from "#/apis/restaurants";
import {
	useGetCategories,
	useGetRestaurants,
	useSyncAllRestaurants,
} from "#/hooks";
import {
	ALL_FILTER_VALUE,
	LARGE_CATEGORY_CODES,
	REGION_CODES,
	toLargeCategoryLabel,
} from "#/shared/constants/domain-labels";
import { useAutoDismissToast } from "#/shared/hooks";
import { getErrorMessage } from "#/shared/utils";

const PAGE_SIZE = 6;
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

const getCategoryLabel = (category: CategoryOption): string => {
	const large = category.largeCategory?.trim();
	const medium = category.mediumCategory?.trim() ?? category.name;

	if (large && medium) {
		return `${toLargeCategoryLabel(large)} · ${medium}`;
	}

	return medium;
};

export function useRestaurantListPage() {
	const [keywordInput, setKeywordInput] = useState("");
	const [toastMessage, setToastMessage] = useState("");
	const [imageErrorById, setImageErrorById] = useState<Record<number, true>>(
		{},
	);
	const [query, setQuery] = useState<RestaurantListQuery>({
		page: 0,
		size: PAGE_SIZE,
	});

	const { data: categories = [] } = useGetCategories();
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

	const categoryNameById = useMemo(() => {
		return categories.reduce<Record<number, string>>((acc, category) => {
			acc[category.id] = getCategoryLabel(category);
			return acc;
		}, {});
	}, [categories]);

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
		categories.forEach((category) => {
			if (category.largeCategory) {
				optionSet.add(category.largeCategory);
			}
		});

		return Array.from(optionSet);
	}, [categories, query.largeCategory]);

	useEffect(() => {
		setImageErrorById({});
	}, [pageResponse.content]);

	useAutoDismissToast(toastMessage, clearToastMessage);

	const applySearch = useCallback(() => {
		setQuery((current) => ({
			...current,
			page: 0,
			keyword: keywordInput.trim() || undefined,
		}));
	}, [keywordInput]);

	const handleRegionChange = useCallback((region: string) => {
		setQuery((current) => ({
			...current,
			page: 0,
			region: region === ALL_FILTER_VALUE ? undefined : region,
		}));
	}, []);

	const handleLargeCategoryChange = useCallback(
		(rawLargeCategory: string) => {
			setQuery((current) => ({
				...current,
				page: 0,
				largeCategory:
					rawLargeCategory === ALL_FILTER_VALUE
						? undefined
						: rawLargeCategory,
				categoryId: undefined,
			}));
		},
		[],
	);

	const handlePageMove = useCallback((direction: "prev" | "next") => {
		setQuery((current) => {
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
	}, []);

	const handleSyncAll = useCallback(async () => {
		try {
			const result = await syncAllMutation.mutateAsync();
			setToastMessage(result.message ?? "전체 동기화가 완료되었습니다.");
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
		categoryNameById,
		errorMessage,
		handleImageError,
		handleLargeCategoryChange,
		handlePageMove,
		handleRegionChange,
		handleSyncAll,
		imageErrorById,
		isLoading,
		isSyncingAll,
		keywordInput,
		largeCategoryOptions,
		pageResponse,
		query,
		regionOptions,
		setKeywordInput,
		toastMessage,
		applySearch,
	};
}
