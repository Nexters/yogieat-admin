import { useCallback, useEffect, useMemo, useState } from "react";

import type { CategoryOption, RestaurantDetail } from "#/apis/restaurants";
import {
	useGetCategories,
	useGetRestaurantById,
	useSyncRestaurant,
	useUpdateRestaurant,
} from "#/hooks";
import {
	getCategoryLabel,
	REGION_OPTIONS,
} from "#/pageComponents/restaurants/detail/constants";
import type {
	CategoryGroup,
	DraftChangeHandler,
	EditableRestaurant,
} from "#/pageComponents/restaurants/detail/types";
import {
	toEditableRestaurant,
	toRestaurantPatchRequest,
} from "#/pageComponents/restaurants/detail/types";
import { useAutoDismissToast } from "#/shared/hooks";
import { getErrorMessage } from "#/shared/utils";

type UseRestaurantDetailPageParams = {
	hasValidId: boolean;
	restaurantId: number;
};

export function useRestaurantDetailPage({
	hasValidId,
	restaurantId,
}: UseRestaurantDetailPageParams) {
	const { data: categories = [] } = useGetCategories();
	const {
		data: restaurantQueryData,
		error: restaurantQueryError,
		isLoading,
	} = useGetRestaurantById(restaurantId, hasValidId);

	const updateRestaurantMutation = useUpdateRestaurant();
	const syncRestaurantMutation = useSyncRestaurant();

	const isSaving = updateRestaurantMutation.isPending;
	const isSyncing = syncRestaurantMutation.isPending;

	const [restaurant, setRestaurant] = useState<RestaurantDetail | null>(null);
	const [draft, setDraft] = useState<EditableRestaurant | null>(null);
	const [isEditMode, setIsEditMode] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");
	const [toastMessage, setToastMessage] = useState("");
	const [isDetailImageError, setIsDetailImageError] = useState(false);
	const [activeLargeCategory, setActiveLargeCategory] = useState("");
	const [categoryKeyword, setCategoryKeyword] = useState("");

	const loadErrorMessage = restaurantQueryError
		? getErrorMessage(
				restaurantQueryError,
				"맛집 상세 정보를 불러오지 못했습니다.",
			)
		: "";

	const clearToastMessage = useCallback(() => {
		setToastMessage("");
	}, []);

	const selectedCategoryInDraft = useMemo(() => {
		if (!draft) {
			return undefined;
		}

		return categories.find(
			(category) => String(category.id) === draft.categoryId,
		);
	}, [categories, draft]);

	const selectedCategory = useMemo(() => {
		if (!restaurant) {
			return undefined;
		}

		return categories.find(
			(category) => category.id === restaurant.categoryId,
		);
	}, [categories, restaurant]);

	const categoryGroups = useMemo<CategoryGroup[]>(() => {
		const grouped = new Map<string, CategoryOption[]>();
		categories.forEach((category) => {
			const largeCategory = category.largeCategory?.trim() || "OTHER";
			const current = grouped.get(largeCategory) ?? [];
			current.push(category);
			grouped.set(largeCategory, current);
		});

		return Array.from(grouped.entries()).map(([largeCategory, items]) => ({
			largeCategory,
			items: [...items].sort((a, b) =>
				(a.mediumCategory ?? a.name).localeCompare(
					b.mediumCategory ?? b.name,
					"ko-KR",
				),
			),
		}));
	}, [categories]);

	const activeCategoryGroup = useMemo(() => {
		if (categoryGroups.length === 0) {
			return undefined;
		}

		return (
			categoryGroups.find(
				(group) => group.largeCategory === activeLargeCategory,
			) ?? categoryGroups[0]
		);
	}, [activeLargeCategory, categoryGroups]);

	const filteredMediumCategories = useMemo(() => {
		const items = activeCategoryGroup?.items ?? [];
		const keyword = categoryKeyword.trim().toLowerCase();
		if (!keyword) {
			return items;
		}

		return items.filter((category) =>
			(category.mediumCategory ?? category.name)
				.toLowerCase()
				.includes(keyword),
		);
	}, [activeCategoryGroup?.items, categoryKeyword]);

	const detailImageSrc = (
		isEditMode ? (draft?.imageUrl ?? "") : (restaurant?.imageUrl ?? "")
	).trim();
	const hasDetailImage = Boolean(detailImageSrc) && !isDetailImageError;

	useEffect(() => {
		if (!hasValidId) {
			setRestaurant(null);
			setDraft(null);
			return;
		}

		setRestaurant(restaurantQueryData ?? null);
		if (!restaurantQueryData) {
			setDraft(null);
			return;
		}

		if (!isEditMode) {
			setDraft(toEditableRestaurant(restaurantQueryData));
		}
	}, [hasValidId, isEditMode, restaurantQueryData]);

	useAutoDismissToast(toastMessage, clearToastMessage);

	useEffect(() => {
		setIsDetailImageError(false);
	}, [draft?.imageUrl, restaurant?.imageUrl, isEditMode]);

	useEffect(() => {
		if (!isEditMode) {
			return;
		}

		if (categoryGroups.length === 0) {
			setActiveLargeCategory("");
			setCategoryKeyword("");
			return;
		}

		const selectedLargeCategory =
			selectedCategoryInDraft?.largeCategory?.trim();
		if (
			selectedLargeCategory &&
			categoryGroups.some(
				(group) => group.largeCategory === selectedLargeCategory,
			)
		) {
			setActiveLargeCategory(selectedLargeCategory);
			return;
		}

		setActiveLargeCategory((current) => {
			if (
				current &&
				categoryGroups.some((group) => group.largeCategory === current)
			) {
				return current;
			}
			return categoryGroups[0].largeCategory;
		});
		setCategoryKeyword("");
	}, [categoryGroups, isEditMode, selectedCategoryInDraft?.largeCategory]);

	const onDraftChange: DraftChangeHandler = useCallback((key, value) => {
		setDraft((current) => {
			if (!current) {
				return current;
			}

			return {
				...current,
				[key]: value,
			};
		});
	}, []);

	const setCategoryId = useCallback(
		(categoryId: number | null) => {
			onDraftChange("categoryId", categoryId ? String(categoryId) : "");
			if (categoryId === null) {
				return;
			}

			const selected = categories.find(
				(category) => category.id === categoryId,
			);
			const nextLargeCategory = selected?.largeCategory?.trim();
			if (nextLargeCategory) {
				setActiveLargeCategory(nextLargeCategory);
			}
		},
		[categories, onDraftChange],
	);

	const handleEditStart = useCallback(() => {
		if (!restaurant) {
			return;
		}

		setDraft(toEditableRestaurant(restaurant));
		setIsEditMode(true);
		setErrorMessage("");
	}, [restaurant]);

	const handleCancel = useCallback(() => {
		if (!restaurant) {
			return;
		}

		setDraft(toEditableRestaurant(restaurant));
		setIsEditMode(false);
		setErrorMessage("");
	}, [restaurant]);

	const handleSave = useCallback(async () => {
		if (!draft || !hasValidId) {
			return;
		}

		setErrorMessage("");
		try {
			const updated = await updateRestaurantMutation.mutateAsync({
				id: restaurantId,
				patch: toRestaurantPatchRequest(draft),
			});
			setRestaurant(updated);
			setDraft(toEditableRestaurant(updated));
			setIsEditMode(false);
			setToastMessage("맛집 정보가 저장되었습니다.");
		} catch (error) {
			setErrorMessage(
				getErrorMessage(error, "저장 중 오류가 발생했습니다."),
			);
		}
	}, [draft, hasValidId, restaurantId, updateRestaurantMutation]);

	const handleSync = useCallback(async () => {
		if (!hasValidId) {
			return;
		}

		setErrorMessage("");
		try {
			const result =
				await syncRestaurantMutation.mutateAsync(restaurantId);
			setToastMessage(result.message ?? "맛집 동기화가 완료되었습니다.");
		} catch (error) {
			setErrorMessage(
				getErrorMessage(error, "동기화 중 오류가 발생했습니다."),
			);
		}
	}, [hasValidId, restaurantId, syncRestaurantMutation]);

	const regionOptions = useMemo(() => {
		const set = new Set<string>(REGION_OPTIONS);
		if (draft?.region) {
			set.add(draft.region);
		}
		if (restaurant?.region) {
			set.add(restaurant.region);
		}
		return Array.from(set);
	}, [draft?.region, restaurant?.region]);

	return {
		activeCategoryGroup,
		categories,
		categoryGroups,
		categoryKeyword,
		detailImageSrc,
		draft,
		errorMessage,
		filteredMediumCategories,
		handleCancel,
		handleEditStart,
		handleSave,
		handleSync,
		hasDetailImage,
		isEditMode,
		isLoading,
		isSaving,
		isSyncing,
		loadErrorMessage,
		onDraftChange,
		regionOptions,
		restaurant,
		selectedCategory,
		selectedCategoryInDraft,
		setActiveLargeCategory,
		setCategoryId,
		setCategoryKeyword,
		setIsDetailImageError,
		toastMessage,
		toCategoryLabel: getCategoryLabel,
	};
}
