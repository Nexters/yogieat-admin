import {
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import { useSearchParams } from "react-router-dom";

import type {
	RegionCreateRequest,
	RegionDetail,
	RegionPatchRequest,
} from "#/apis/regions";
import {
	useCreateRegion,
	useDeleteRegion,
	useGetRegionById,
	useGetRegionSummaries,
	useUpdateRegion,
} from "#/hooks";
import { useAutoDismissToast } from "#/shared/hooks";
import { getErrorMessage } from "#/shared/utils";

export type RegionStatusFilter = "ALL" | "ACTIVE" | "INACTIVE";

export type RegionDraft = {
	code: string;
	displayName: string;
	longitude: string;
	latitude: string;
	active: boolean;
	sortOrder: string;
};

type RegionDashboardQuery = {
	keyword?: string;
	mode?: "create";
	regionId?: number;
	status: RegionStatusFilter;
};

type RegionDraftErrors = Partial<
	Record<
		"code" | "displayName" | "latitude" | "longitude" | "sortOrder",
		string
	>
>;

const DEFAULT_STATUS_FILTER: RegionStatusFilter = "ALL";

const toTrimmedValue = (value: string | null) => {
	const trimmed = value?.trim();
	return trimmed ? trimmed : undefined;
};

const toPositiveInteger = (value: string | null) => {
	if (!value) {
		return undefined;
	}

	const parsed = Number.parseInt(value, 10);
	return Number.isInteger(parsed) && parsed > 0 ? parsed : undefined;
};

const toRegionDashboardQuery = (
	searchParams: URLSearchParams,
): RegionDashboardQuery => {
	const statusParam = searchParams.get("status");
	const normalizedStatus =
		statusParam === "ACTIVE" || statusParam === "INACTIVE"
			? statusParam
			: DEFAULT_STATUS_FILTER;

	return {
		keyword: toTrimmedValue(searchParams.get("keyword")),
		mode: searchParams.get("mode") === "create" ? "create" : undefined,
		regionId: toPositiveInteger(searchParams.get("regionId")),
		status: normalizedStatus,
	};
};

const toSearchParams = (query: RegionDashboardQuery) => {
	const nextSearchParams = new URLSearchParams();

	if (query.keyword) {
		nextSearchParams.set("keyword", query.keyword);
	}
	if (query.mode === "create") {
		nextSearchParams.set("mode", "create");
	}
	if (typeof query.regionId === "number") {
		nextSearchParams.set("regionId", String(query.regionId));
	}
	if (query.status !== DEFAULT_STATUS_FILTER) {
		nextSearchParams.set("status", query.status);
	}

	return nextSearchParams;
};

const isSameQuery = (
	left: RegionDashboardQuery,
	right: RegionDashboardQuery,
) => {
	return (
		left.keyword === right.keyword &&
		left.mode === right.mode &&
		left.regionId === right.regionId &&
		left.status === right.status
	);
};

const toCoordinateInput = (value: number) => {
	return Number.isInteger(value) ? String(value) : value.toFixed(6);
};

const toRegionDraft = (
	region: RegionDetail,
): RegionDraft => ({
	code: region.code,
	displayName: region.displayName,
	longitude: toCoordinateInput(region.coordinatesStandard.coordinates[0]),
	latitude: toCoordinateInput(region.coordinatesStandard.coordinates[1]),
	active: region.active,
	sortOrder: String(region.sortOrder),
});

const createEmptyDraft = (nextSortOrder: number): RegionDraft => ({
	code: "",
	displayName: "",
	longitude: "",
	latitude: "",
	active: true,
	sortOrder: String(nextSortOrder),
});

const normalizeRegionCode = (value: string) => value.trim().toUpperCase();

const parseRequiredNumber = (value: string): number | null => {
	const trimmed = value.trim();
	if (!trimmed) {
		return null;
	}

	const parsed = Number(trimmed);
	return Number.isFinite(parsed) ? parsed : null;
};

const parseOptionalInteger = (value: string): number | null => {
	const trimmed = value.trim();
	if (!trimmed) {
		return null;
	}

	const parsed = Number(trimmed);
	return Number.isInteger(parsed) ? parsed : null;
};

const getDraftErrors = (
	draft: RegionDraft | null,
	regions: RegionDetail[],
	currentRegionId?: number,
): RegionDraftErrors => {
	if (!draft) {
		return {};
	}

	const errors: RegionDraftErrors = {};
	const normalizedCode = normalizeRegionCode(draft.code);
	const displayName = draft.displayName.trim();
	const longitude = parseRequiredNumber(draft.longitude);
	const latitude = parseRequiredNumber(draft.latitude);
	const sortOrder = parseOptionalInteger(draft.sortOrder);

	if (!normalizedCode) {
		errors.code = "지역 코드를 입력해 주세요.";
	} else if (
		normalizedCode.length > 30 ||
		!/^[A-Z0-9_]+$/.test(normalizedCode)
	) {
		errors.code =
			"지역 코드는 대문자, 숫자, 언더스코어만 사용할 수 있습니다.";
	} else if (
		regions.some(
			(region) =>
				region.id !== currentRegionId && region.code === normalizedCode,
		)
	) {
		errors.code = "이미 사용 중인 지역 코드입니다.";
	}

	if (!displayName) {
		errors.displayName = "운영용 지역명을 입력해 주세요.";
	} else if (displayName.length > 255) {
		errors.displayName = "지역명은 최대 255자까지 가능합니다.";
	} else if (
		regions.some(
			(region) =>
				region.id !== currentRegionId &&
				region.displayName === displayName,
		)
	) {
		errors.displayName = "이미 사용 중인 지역명입니다.";
	}

	if (longitude === null || longitude < -180 || longitude > 180) {
		errors.longitude = "경도는 -180부터 180 사이여야 합니다.";
	}

	if (latitude === null || latitude < -90 || latitude > 90) {
		errors.latitude = "위도는 -90부터 90 사이여야 합니다.";
	}

	if (sortOrder === null || sortOrder < 0) {
		errors.sortOrder = "정렬 순서는 0 이상의 정수여야 합니다.";
	}

	return errors;
};

const buildCreateRequest = (draft: RegionDraft): RegionCreateRequest => ({
	code: normalizeRegionCode(draft.code),
	displayName: draft.displayName.trim(),
	coordinatesStandard: {
		coordinates: [
			Number(draft.longitude.trim()),
			Number(draft.latitude.trim()),
		],
	},
	active: draft.active,
	sortOrder: Number(draft.sortOrder.trim()),
});

const buildPatchRequest = (
	draft: RegionDraft,
	currentRegion: RegionDetail,
): RegionPatchRequest => {
	const patch: RegionPatchRequest = {};
	const nextCode = normalizeRegionCode(draft.code);
	const nextDisplayName = draft.displayName.trim();
	const nextLongitude = Number(draft.longitude.trim());
	const nextLatitude = Number(draft.latitude.trim());
	const nextSortOrder = Number(draft.sortOrder.trim());

	if (nextCode !== currentRegion.code) {
		patch.code = nextCode;
	}
	if (nextDisplayName !== currentRegion.displayName) {
		patch.displayName = nextDisplayName;
	}
	if (
		nextLongitude !== currentRegion.coordinatesStandard.coordinates[0] ||
		nextLatitude !== currentRegion.coordinatesStandard.coordinates[1]
	) {
		patch.coordinatesStandard = {
			coordinates: [nextLongitude, nextLatitude],
		};
	}
	if (draft.active !== currentRegion.active) {
		patch.active = draft.active;
	}
	if (nextSortOrder !== currentRegion.sortOrder) {
		patch.sortOrder = nextSortOrder;
	}

	return patch;
};

const hasFormChanges = (
	draft: RegionDraft | null,
	currentRegion: RegionDetail | null,
	isCreateMode: boolean,
	nextSortOrder: number,
) => {
	if (!draft) {
		return false;
	}

	if (isCreateMode) {
		const initialDraft = createEmptyDraft(nextSortOrder);
		return JSON.stringify(draft) !== JSON.stringify(initialDraft);
	}

	if (!currentRegion) {
		return false;
	}

	return JSON.stringify(draft) !== JSON.stringify(toRegionDraft(currentRegion));
};

export function useRegionDashboardPage() {
	const [searchParams, setSearchParams] = useSearchParams();
	const [query, setQuery] = useState<RegionDashboardQuery>(() =>
		toRegionDashboardQuery(searchParams),
	);
	const [keywordInput, setKeywordInput] = useState(query.keyword ?? "");
	const [isEditing, setIsEditing] = useState(query.mode === "create");
	const [draft, setDraft] = useState<RegionDraft | null>(null);
	const [toastMessage, setToastMessage] = useState("");
	const [panelErrorMessage, setPanelErrorMessage] = useState("");
	const [deleteTargetRegion, setDeleteTargetRegion] =
		useState<RegionDetail | null>(null);
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
	const lastViewedRegionIdRef = useRef<number | undefined>(query.regionId);

	const {
		data: regionListResponse = { regions: [] },
		error: regionListError,
		isLoading: isRegionListLoading,
	} = useGetRegionSummaries();

	const selectedRegionId =
		query.mode === "create" ? undefined : query.regionId;

	const {
		data: regionDetail,
		error: regionDetailError,
		isLoading: isRegionDetailLoading,
	} = useGetRegionById(
		selectedRegionId ?? 0,
		typeof selectedRegionId === "number",
	);

	const createRegionMutation = useCreateRegion();
	const updateRegionMutation = useUpdateRegion();
	const deleteRegionMutation = useDeleteRegion();

	const regions = regionListResponse.regions;
	const selectedRegionFromList = useMemo(() => {
		if (typeof selectedRegionId !== "number") {
			return null;
		}

		return regions.find((region) => region.id === selectedRegionId) ?? null;
	}, [regions, selectedRegionId]);

	const selectedRegion = regionDetail ?? selectedRegionFromList ?? null;
	const isCreateMode = query.mode === "create";
	const nextSortOrder = useMemo(() => {
		return (
			regions.reduce(
				(maxSortOrder, region) => Math.max(maxSortOrder, region.sortOrder),
				-1,
			) + 1
		);
	}, [regions]);

	const filteredRegions = useMemo(() => {
		const normalizedKeyword = query.keyword?.toLowerCase();

		return regions.filter((region) => {
			const matchesStatus =
				query.status === "ALL"
					? true
					: query.status === "ACTIVE"
						? region.active
						: !region.active;
			const matchesKeyword = normalizedKeyword
				? [region.code, region.displayName]
						.join(" ")
						.toLowerCase()
						.includes(normalizedKeyword)
				: true;

			return matchesStatus && matchesKeyword;
		});
	}, [query.keyword, query.status, regions]);

	const totalRegionCount = regions.length;
	const activeRegionCount = useMemo(() => {
		return regions.filter((region) => region.active).length;
	}, [regions]);
	const inactiveRegionCount = totalRegionCount - activeRegionCount;
	const totalRestaurantCount = useMemo(() => {
		return regions.reduce(
			(accumulator, region) => accumulator + region.restaurantCount,
			0,
		);
	}, [regions]);

	const draftErrors = useMemo(
		() => getDraftErrors(draft, regions, selectedRegion?.id),
		[draft, regions, selectedRegion?.id],
	);
	const hasUnsavedChanges = useMemo(
		() => hasFormChanges(draft, selectedRegion, isCreateMode, nextSortOrder),
		[draft, isCreateMode, nextSortOrder, selectedRegion],
	);
	const canSubmit =
		Boolean(draft) &&
		Object.values(draftErrors).every((message) => !message) &&
		(isCreateMode || hasUnsavedChanges);

	const setQueryWithSync = useCallback(
		(
			nextQuery:
				| RegionDashboardQuery
				| ((current: RegionDashboardQuery) => RegionDashboardQuery),
		) => {
			setQuery((current) => {
				const resolvedQuery =
					typeof nextQuery === "function"
						? nextQuery(current)
						: nextQuery;
				const normalizedQuery: RegionDashboardQuery = {
					keyword: toTrimmedValue(resolvedQuery.keyword ?? null),
					mode:
						resolvedQuery.mode === "create" ? "create" : undefined,
					regionId: resolvedQuery.regionId,
					status: resolvedQuery.status ?? DEFAULT_STATUS_FILTER,
				};

				if (isSameQuery(current, normalizedQuery)) {
					return current;
				}

				setSearchParams(toSearchParams(normalizedQuery), {
					replace: true,
				});
				return normalizedQuery;
			});
		},
		[setSearchParams],
	);

	useEffect(() => {
		const nextQuery = toRegionDashboardQuery(searchParams);
		setQuery((current) =>
			isSameQuery(current, nextQuery) ? current : nextQuery,
		);
	}, [searchParams]);

	useEffect(() => {
		setKeywordInput(query.keyword ?? "");
	}, [query.keyword]);

	useEffect(() => {
		if (!isCreateMode && typeof query.regionId === "number") {
			lastViewedRegionIdRef.current = query.regionId;
		}
	}, [isCreateMode, query.regionId]);

	useEffect(() => {
		if (isCreateMode) {
			setIsEditing(true);
			setDraft((currentDraft) => currentDraft ?? createEmptyDraft(nextSortOrder));
			return;
		}

		if (!selectedRegion) {
			setDraft(null);
			setIsEditing(false);
			return;
		}

		if (!isEditing) {
			setDraft(toRegionDraft(selectedRegion));
		}
	}, [isCreateMode, isEditing, nextSortOrder, selectedRegion]);

	useEffect(() => {
		if (isCreateMode || isRegionListLoading) {
			return;
		}

		if (typeof query.regionId === "number") {
			const matchedRegion = filteredRegions.find(
				(region) => region.id === query.regionId,
			);

			if (!matchedRegion) {
				setQueryWithSync((current) => ({
					...current,
					regionId: filteredRegions[0]?.id,
				}));
			}
			return;
		}

		if (filteredRegions.length > 0) {
			setQueryWithSync((current) => ({
				...current,
				regionId: filteredRegions[0].id,
			}));
		}
	}, [
		filteredRegions,
		isCreateMode,
		isRegionListLoading,
		query.regionId,
		setQueryWithSync,
	]);

	const clearToastMessage = useCallback(() => {
		setToastMessage("");
	}, []);

	useAutoDismissToast(toastMessage, clearToastMessage);

	const handleSearchInputChange = useCallback((value: string) => {
		setKeywordInput(value);
	}, []);

	const applySearch = useCallback(() => {
		setQueryWithSync((current) => ({
			...current,
			keyword: keywordInput.trim() || undefined,
			regionId: current.regionId,
		}));
	}, [keywordInput, setQueryWithSync]);

	const handleStatusChange = useCallback(
		(status: RegionStatusFilter) => {
			setQueryWithSync((current) => ({
				...current,
				status,
			}));
		},
		[setQueryWithSync],
	);

	const handleSelectRegion = useCallback(
		(regionId: number) => {
			setPanelErrorMessage("");
			setIsDeleteDialogOpen(false);
			setDeleteTargetRegion(null);
			setIsEditing(false);
			setQueryWithSync((current) => ({
				...current,
				mode: undefined,
				regionId,
			}));
		},
		[setQueryWithSync],
	);

	const handleOpenCreate = useCallback(() => {
		setPanelErrorMessage("");
		setIsDeleteDialogOpen(false);
		setDeleteTargetRegion(null);
		setIsEditing(true);
		setDraft(createEmptyDraft(nextSortOrder));
		setQueryWithSync((current) => ({
			...current,
			mode: "create",
			regionId: undefined,
		}));
	}, [nextSortOrder, setQueryWithSync]);

	const handleEditStart = useCallback(() => {
		if (!selectedRegion) {
			return;
		}

		setPanelErrorMessage("");
		setIsEditing(true);
		setDraft(toRegionDraft(selectedRegion));
	}, [selectedRegion]);

	const handleCancel = useCallback(() => {
		setPanelErrorMessage("");
		setDeleteTargetRegion(null);
		setIsDeleteDialogOpen(false);

		if (isCreateMode) {
			setIsEditing(false);
			setDraft(null);
			setQueryWithSync((current) => ({
				...current,
				mode: undefined,
				regionId:
					lastViewedRegionIdRef.current ??
					filteredRegions[0]?.id ??
					regions[0]?.id,
			}));
			return;
		}

		setIsEditing(false);
		setDraft(selectedRegion ? toRegionDraft(selectedRegion) : null);
	}, [
		filteredRegions,
		isCreateMode,
		regions,
		selectedRegion,
		setQueryWithSync,
	]);

	const handleDraftChange = useCallback(
		<Key extends keyof RegionDraft>(key: Key, value: RegionDraft[Key]) => {
			setPanelErrorMessage("");
			setDraft((currentDraft) =>
				currentDraft
					? {
							...currentDraft,
							[key]:
								key === "code" && typeof value === "string"
									? normalizeRegionCode(value)
									: value,
						}
					: currentDraft,
			);
		},
		[],
	);

	const handleSubmit = useCallback(async () => {
		if (!draft) {
			return;
		}

		if (!canSubmit) {
			setPanelErrorMessage("입력값을 확인한 뒤 다시 저장해 주세요.");
			return;
		}

		try {
			setPanelErrorMessage("");

			if (isCreateMode) {
				const createdRegion = await createRegionMutation.mutateAsync(
					buildCreateRequest(draft),
				);
				setToastMessage(
					`"${createdRegion.displayName}" 지역을 등록했습니다.`,
				);
				setIsEditing(false);
				setDraft(toRegionDraft(createdRegion));
				setQueryWithSync((current) => ({
					...current,
					mode: undefined,
					regionId: createdRegion.id,
				}));
				return;
			}

			if (!selectedRegion) {
				return;
			}

			const patch = buildPatchRequest(draft, selectedRegion);
			if (Object.keys(patch).length === 0) {
				setPanelErrorMessage("변경된 내용이 없습니다.");
				return;
			}

			const updatedRegion = await updateRegionMutation.mutateAsync({
				id: selectedRegion.id,
				patch,
			});
			setToastMessage(`"${updatedRegion.displayName}" 지역을 수정했습니다.`);
			setIsEditing(false);
			setDraft(toRegionDraft(updatedRegion));
		} catch (error) {
			setPanelErrorMessage(
				getErrorMessage(
					error,
					isCreateMode
						? "지역 등록에 실패했습니다."
						: "지역 수정에 실패했습니다.",
				),
			);
		}
	}, [
		canSubmit,
		createRegionMutation,
		draft,
		isCreateMode,
		selectedRegion,
		setQueryWithSync,
		updateRegionMutation,
	]);

	const deleteDisabledReason = isCreateMode
		? "신규 등록 중에는 삭제할 수 없습니다."
		: selectedRegion?.restaurantCount
			? "연결된 맛집이 있으면 삭제 대신 비활성화를 권장합니다."
			: "";

	const canDeleteSelected = Boolean(
		selectedRegion &&
			selectedRegion.restaurantCount === 0 &&
			!isCreateMode,
	);

	const openDeleteDialog = useCallback(() => {
		if (!selectedRegion || !canDeleteSelected) {
			return;
		}

		setDeleteTargetRegion(selectedRegion);
		setIsDeleteDialogOpen(true);
	}, [canDeleteSelected, selectedRegion]);

	const closeDeleteDialog = useCallback(() => {
		setIsDeleteDialogOpen(false);
		setDeleteTargetRegion(null);
	}, []);

	const handleDeleteConfirm = useCallback(async () => {
		if (!deleteTargetRegion) {
			return;
		}

		try {
			await deleteRegionMutation.mutateAsync(deleteTargetRegion.id);
			setToastMessage(
				`"${deleteTargetRegion.displayName}" 지역을 삭제했습니다.`,
			);
			setPanelErrorMessage("");
			setIsEditing(false);
			setDraft(null);
			closeDeleteDialog();
			setQueryWithSync((current) => ({
				...current,
				mode: undefined,
				regionId: undefined,
			}));
		} catch (error) {
			closeDeleteDialog();
			setPanelErrorMessage(
				getErrorMessage(error, "지역 삭제에 실패했습니다."),
			);
		}
	}, [closeDeleteDialog, deleteRegionMutation, deleteTargetRegion, setQueryWithSync]);

	const listErrorMessage = regionListError
		? getErrorMessage(regionListError, "지역 목록을 불러오지 못했습니다.")
		: "";
	const detailErrorMessage =
		regionDetailError && !selectedRegion
			? getErrorMessage(regionDetailError, "지역 상세 정보를 불러오지 못했습니다.")
			: "";

	return {
		activeRegionCount,
		canDeleteSelected,
		canSubmit,
		clearToastMessage,
		closeDeleteDialog,
		deleteDisabledReason,
		deleteTargetRegion,
		detailErrorMessage,
		draft,
		draftErrors,
		filteredRegions,
		handleCancel,
		handleDeleteConfirm,
		handleDraftChange,
		handleEditStart,
		handleOpenCreate,
		handleSearchInputChange,
		handleSelectRegion,
		handleStatusChange,
		handleSubmit,
		hasUnsavedChanges,
		inactiveRegionCount,
		isCreateMode,
		isDeleteDialogOpen,
		isDeleting: deleteRegionMutation.isPending,
		isEditing,
		isLoadingDetail: isRegionDetailLoading,
		isLoadingList: isRegionListLoading,
		isSaving:
			createRegionMutation.isPending || updateRegionMutation.isPending,
		keywordInput,
		listErrorMessage,
		nextSortOrder,
		openDeleteDialog,
		panelErrorMessage,
		query,
		selectedRegion,
		toastMessage,
		totalRegionCount,
		totalRestaurantCount,
		applySearch,
	};
}
