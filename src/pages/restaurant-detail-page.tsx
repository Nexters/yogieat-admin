import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
	CategoryOption,
	RestaurantDetail,
	RestaurantPatchRequest,
	adminService,
} from "../apis/admin";
import { Button, Toast } from "../shared/ui";
import { NotFoundPage } from "./not-found-page";

const REGION_OPTIONS = [
	"EULJIRO3GA",
	"GANGNAM",
	"JONGNO3GA",
	"SEOUL",
	"BUSAN",
	"DAEGU",
	"JEJU",
];
const PRICE_LEVEL_OPTIONS = ["₩", "₩₩", "₩₩₩", "₩₩₩₩", "₩₩₩₩₩"];
const TIME_SLOT_OPTIONS = [
	"BREAKFAST",
	"LUNCH",
	"DINNER",
	"LATE_NIGHT",
	"ANY",
	"BOTH",
] as const;

const formatTimestamp = (value: string) =>
	new Intl.DateTimeFormat("ko-KR", {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
		hour12: false,
	}).format(new Date(value));

const toNullableNumber = (value: string) => {
	if (!value.trim()) {
		return null;
	}

	const parsed = Number(value);
	return Number.isFinite(parsed) ? parsed : null;
};

const getCategoryLabel = (category: CategoryOption): string => {
	const large = category.largeCategory?.trim();
	const medium = category.mediumCategory?.trim() ?? category.name;

	if (large && medium) {
		return `${large} · ${medium}`;
	}

	return medium;
};

type EditableRestaurant = {
	externalId: string;
	categoryId: string;
	name: string;
	address: string;
	rating: string;
	imageUrl: string;
	mapUrl: string;
	representativeReview: string;
	description: string;
	region: string;
	reviewCount: string;
	blogReviewCount: string;
	representMenu: string;
	representMenuPrice: string;
	priceLevel: string;
	aiMateSummaryTitle: string;
	aiMateSummaryContents: string;
	timeSlot: string;
	longitude: string;
	latitude: string;
};

type CategoryGroup = {
	items: CategoryOption[];
	largeCategory: string;
};

const toEditable = (restaurant: RestaurantDetail): EditableRestaurant => ({
	externalId: restaurant.externalId,
	categoryId:
		typeof restaurant.categoryId === "number"
			? String(restaurant.categoryId)
			: "",
	name: restaurant.name,
	address: restaurant.address,
	rating: restaurant.rating !== null ? String(restaurant.rating) : "",
	imageUrl: restaurant.imageUrl,
	mapUrl: restaurant.mapUrl,
	representativeReview: restaurant.representativeReview,
	description: restaurant.description,
	region: restaurant.region,
	reviewCount:
		restaurant.reviewCount !== null ? String(restaurant.reviewCount) : "",
	blogReviewCount:
		restaurant.blogReviewCount !== null
			? String(restaurant.blogReviewCount)
			: "",
	representMenu: restaurant.representMenu,
	representMenuPrice:
		restaurant.representMenuPrice !== null
			? String(restaurant.representMenuPrice)
			: "",
	priceLevel: restaurant.priceLevel,
	aiMateSummaryTitle: restaurant.aiMateSummaryTitle,
	aiMateSummaryContents: restaurant.aiMateSummaryContents.join("\n"),
	timeSlot: restaurant.timeSlot,
	longitude: String(restaurant.location?.coordinates[0] ?? ""),
	latitude: String(restaurant.location?.coordinates[1] ?? ""),
});

const toPatchRequest = (draft: EditableRestaurant): RestaurantPatchRequest => {
	const longitude = toNullableNumber(draft.longitude);
	const latitude = toNullableNumber(draft.latitude);

	return {
		externalId: draft.externalId.trim(),
		categoryId: toNullableNumber(draft.categoryId),
		name: draft.name.trim(),
		address: draft.address.trim(),
		rating: toNullableNumber(draft.rating),
		imageUrl: draft.imageUrl.trim(),
		mapUrl: draft.mapUrl.trim(),
		representativeReview: draft.representativeReview.trim(),
		description: draft.description.trim(),
		region: draft.region,
		reviewCount: toNullableNumber(draft.reviewCount),
		blogReviewCount: toNullableNumber(draft.blogReviewCount),
		representMenu: draft.representMenu.trim(),
		representMenuPrice: toNullableNumber(draft.representMenuPrice),
		priceLevel: draft.priceLevel,
		aiMateSummaryTitle: draft.aiMateSummaryTitle.trim(),
		aiMateSummaryContents: draft.aiMateSummaryContents
			.split("\n")
			.map((line) => line.trim())
			.filter(Boolean),
		timeSlot: draft.timeSlot as RestaurantDetail["timeSlot"],
		location:
			longitude !== null && latitude !== null
				? { coordinates: [longitude, latitude] }
				: null,
	};
};

function DetailField({
	children,
	className,
	label,
}: {
	children: React.ReactNode;
	className?: string;
	label: string;
}) {
	return (
		<label className={`admin-field${className ? ` ${className}` : ""}`}>
			<span>{label}</span>
			{children}
		</label>
	);
}

function DetailSection({
	children,
	description,
	title,
}: {
	children: React.ReactNode;
	description: string;
	title: string;
}) {
	return (
		<section className="admin-detail-section">
			<header className="admin-detail-section__header">
				<h2>{title}</h2>
				<p>{description}</p>
			</header>
			{children}
		</section>
	);
}

export function RestaurantDetailPage() {
	const navigate = useNavigate();
	const { restaurantId: restaurantIdParam } = useParams();
	const restaurantId = Number(restaurantIdParam);
	const hasValidId = Number.isFinite(restaurantId) && restaurantId > 0;
	const [categories, setCategories] = useState<CategoryOption[]>([]);
	const [restaurant, setRestaurant] = useState<RestaurantDetail | null>(null);
	const [draft, setDraft] = useState<EditableRestaurant | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isEditMode, setIsEditMode] = useState(false);
	const [isSaving, setIsSaving] = useState(false);
	const [isSyncing, setIsSyncing] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");
	const [toastMessage, setToastMessage] = useState("");
	const [isDetailImageError, setIsDetailImageError] = useState(false);
	const [activeLargeCategory, setActiveLargeCategory] = useState("");
	const [categoryKeyword, setCategoryKeyword] = useState("");
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
	}, [activeCategoryGroup, categoryKeyword]);

	const fetchRestaurant = useCallback(async () => {
		if (!hasValidId) {
			setIsLoading(false);
			setRestaurant(null);
			return;
		}

		setIsLoading(true);
		setErrorMessage("");

		try {
			const response = await adminService.getRestaurantById(restaurantId);
			setRestaurant(response);
			if (response) {
				setDraft(toEditable(response));
			}
		} catch (error) {
			if (error instanceof Error) {
				setErrorMessage(error.message);
			} else {
				setErrorMessage("맛집 상세 정보를 불러오지 못했습니다.");
			}
		} finally {
			setIsLoading(false);
		}
	}, [hasValidId, restaurantId]);

	useEffect(() => {
		let mounted = true;
		adminService
			.getCategories()
			.then((response) => {
				if (!mounted) {
					return;
				}
				setCategories(response);
			})
			.catch(() => {
				if (!mounted) {
					return;
				}
				setCategories([]);
			});

		return () => {
			mounted = false;
		};
	}, []);

	useEffect(() => {
		fetchRestaurant();
	}, [fetchRestaurant]);

	useEffect(() => {
		if (!toastMessage) {
			return;
		}

		const timer = window.setTimeout(() => {
			setToastMessage("");
		}, 2200);

		return () => {
			window.clearTimeout(timer);
		};
	}, [toastMessage]);

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

	const handleEditStart = () => {
		if (!restaurant) {
			return;
		}

		setDraft(toEditable(restaurant));
		setIsEditMode(true);
		setErrorMessage("");
	};

	const handleCancel = () => {
		if (!restaurant) {
			return;
		}

		setDraft(toEditable(restaurant));
		setIsEditMode(false);
		setErrorMessage("");
	};

	const handleSave = async () => {
		if (!draft || !hasValidId) {
			return;
		}

		setIsSaving(true);
		setErrorMessage("");
		try {
			const updated = await adminService.updateRestaurant(
				restaurantId,
				toPatchRequest(draft),
			);
			setRestaurant(updated);
			setDraft(toEditable(updated));
			setIsEditMode(false);
			setToastMessage("맛집 정보가 저장되었습니다.");
		} catch (error) {
			if (error instanceof Error) {
				setErrorMessage(error.message);
			} else {
				setErrorMessage("저장 중 오류가 발생했습니다.");
			}
		} finally {
			setIsSaving(false);
		}
	};

	const handleSync = async () => {
		if (!hasValidId) {
			return;
		}

		setIsSyncing(true);
		setErrorMessage("");
		try {
			const result = await adminService.syncRestaurant(restaurantId);
			await fetchRestaurant();
			setToastMessage(result.message ?? "맛집 동기화가 완료되었습니다.");
		} catch (error) {
			if (error instanceof Error) {
				setErrorMessage(error.message);
			} else {
				setErrorMessage("동기화 중 오류가 발생했습니다.");
			}
		} finally {
			setIsSyncing(false);
		}
	};

	const onDraftChange = <K extends keyof EditableRestaurant>(
		key: K,
		value: EditableRestaurant[K],
	) => {
		setDraft((current) => {
			if (!current) {
				return current;
			}

			return {
				...current,
				[key]: value,
			};
		});
	};

	const setCategoryId = (categoryId: number | null) => {
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
	};

	const categoryOptions = useMemo(() => {
		const set = new Set<string>(REGION_OPTIONS);
		if (draft?.region) {
			set.add(draft.region);
		}
		if (restaurant?.region) {
			set.add(restaurant.region);
		}
		return Array.from(set);
	}, [draft?.region, restaurant?.region]);

	if (!hasValidId) {
		return (
			<NotFoundPage
				title="유효하지 않은 맛집 ID입니다."
				description="목록으로 이동해 다시 선택해 주세요."
			/>
		);
	}

	if (isLoading) {
		return (
			<main className="admin-shell">
				<section className="admin-panel admin-panel--status">
					<p>맛집 정보를 불러오는 중입니다.</p>
				</section>
			</main>
		);
	}

	if (!restaurant || !draft) {
		return (
			<NotFoundPage
				title="요청한 맛집을 찾을 수 없습니다."
				description="삭제되었거나 접근 권한이 없는 데이터일 수 있습니다."
			/>
		);
	}

	const detailImageSrc = (
		isEditMode ? draft.imageUrl : restaurant.imageUrl
	).trim();
	const hasDetailImage = Boolean(detailImageSrc) && !isDetailImageError;

	return (
		<main className="admin-shell">
			<header className="admin-topbar">
				<div className="admin-topbar__title-wrap">
					<p className="admin-topbar__eyebrow">Restaurant Detail</p>
					<h1>{restaurant.name}</h1>
				</div>
				<div className="admin-topbar__actions admin-topbar__actions--detail">
					<Button
						variant="inverse"
						size="sm"
						onClick={() => navigate("/restaurants")}
					>
						목록으로
					</Button>
					<Button
						variant="inverse"
						size="sm"
						onClick={() => navigate("/gatherings")}
					>
						모임 관리
					</Button>
					{isEditMode ? (
						<>
							<Button
								size="sm"
								variant="secondary"
								loading={isSaving}
								onClick={handleSave}
							>
								저장
							</Button>
							<Button
								size="sm"
								variant="tertiary"
								disabled={isSaving}
								onClick={handleCancel}
							>
								취소
							</Button>
						</>
					) : (
						<Button
							size="sm"
							variant="secondary"
							onClick={handleEditStart}
						>
							편집
						</Button>
					)}
					<Button
						size="sm"
						variant="primary"
						loading={isSyncing}
						disabled={isSaving}
						onClick={handleSync}
					>
						단일 동기화
					</Button>
				</div>
			</header>

			<section className="admin-panel admin-panel--detail">
				<div className="admin-detail-image-panel">
					{hasDetailImage ? (
						<img
							src={detailImageSrc}
							alt={`${restaurant.name} 대표 이미지`}
							className="admin-detail-image"
							onError={() => setIsDetailImageError(true)}
						/>
					) : (
						<div className="admin-detail-image admin-detail-image--fallback">
							<span>이미지를 불러올 수 없습니다.</span>
						</div>
					)}
				</div>

				{errorMessage ? (
					<p className="admin-error" role="alert">
						{errorMessage}
					</p>
				) : null}

				<div className="admin-detail-sections">
					<DetailSection
						title="기본 정보"
						description="식당 식별 정보와 운영 기본 속성을 확인합니다."
					>
						<div className="admin-detail-grid">
							<DetailField label="고유 ID">
								{isEditMode ? (
									<input
										value={draft.externalId}
										onChange={(event) =>
											onDraftChange(
												"externalId",
												event.target.value,
											)
										}
									/>
								) : (
									<div className="admin-readonly">
										{restaurant.externalId}
									</div>
								)}
							</DetailField>
							<DetailField
								label="카테고리"
								className="admin-field--full"
							>
								{isEditMode ? (
									<div className="admin-category-picker">
										<div className="admin-category-dropzone">
											<p className="admin-category-dropzone__title">
												선택된 카테고리
											</p>
											{selectedCategoryInDraft ? (
												<div className="admin-category-token">
													{getCategoryLabel(
														selectedCategoryInDraft,
													)}
												</div>
											) : (
												<p className="admin-category-dropzone__placeholder">
													대 카테고리를 선택한 뒤 아래
													목록을 스크롤해 세부
													카테고리를 선택해 주세요.
												</p>
											)}
											<Button
												size="sm"
												variant="tertiary"
												onClick={() =>
													setCategoryId(null)
												}
											>
												카테고리 해제
											</Button>
										</div>
										<div className="admin-category-browser">
											<div className="admin-category-group-tabs">
												{categoryGroups.map((group) => {
													const isActive =
														group.largeCategory ===
														activeCategoryGroup?.largeCategory;

													return (
														<button
															type="button"
															key={
																group.largeCategory
															}
															className={`admin-category-group-tab${
																isActive
																	? " admin-category-group-tab--active"
																	: ""
															}`}
															onClick={() =>
																setActiveLargeCategory(
																	group.largeCategory,
																)
															}
														>
															{
																group.largeCategory
															}
															<span>
																(
																{
																	group.items
																		.length
																}
																)
															</span>
														</button>
													);
												})}
											</div>
											<div className="admin-category-search">
												<input
													type="text"
													value={categoryKeyword}
													onChange={(event) =>
														setCategoryKeyword(
															event.target.value,
														)
													}
													placeholder="세부 카테고리 검색"
													aria-label="세부 카테고리 검색"
												/>
												<span>
													{
														filteredMediumCategories.length
													}
													개
												</span>
											</div>
											<ul className="admin-category-medium-list">
												{filteredMediumCategories.map(
													(category) => {
														const isSelected =
															draft.categoryId ===
															String(category.id);
														const mediumName =
															category.mediumCategory ??
															category.name;
														return (
															<li
																key={
																	category.id
																}
															>
																<button
																	type="button"
																	className={`admin-category-medium-item${
																		isSelected
																			? " admin-category-medium-item--selected"
																			: ""
																	}`}
																	onClick={() =>
																		setCategoryId(
																			category.id,
																		)
																	}
																>
																	<span className="admin-category-medium-item__name">
																		{
																			mediumName
																		}
																	</span>
																</button>
															</li>
														);
													},
												)}
												{!filteredMediumCategories.length ? (
													<li>
														<p className="admin-category-empty">
															{categoryKeyword.trim()
																? "검색 결과가 없습니다."
																: "카테고리가 없습니다."}
														</p>
													</li>
												) : null}
											</ul>
										</div>
									</div>
								) : (
									<div className="admin-readonly">
										{selectedCategory
											? getCategoryLabel(selectedCategory)
											: (restaurant.categoryId ?? "-")}
									</div>
								)}
							</DetailField>
							<DetailField label="이름">
								{isEditMode ? (
									<input
										value={draft.name}
										onChange={(event) =>
											onDraftChange(
												"name",
												event.target.value,
											)
										}
									/>
								) : (
									<div className="admin-readonly">
										{restaurant.name}
									</div>
								)}
							</DetailField>
							<DetailField label="주소">
								{isEditMode ? (
									<input
										value={draft.address}
										onChange={(event) =>
											onDraftChange(
												"address",
												event.target.value,
											)
										}
									/>
								) : (
									<div className="admin-readonly">
										{restaurant.address}
									</div>
								)}
							</DetailField>
							<DetailField label="평점">
								{isEditMode ? (
									<input
										value={draft.rating}
										onChange={(event) =>
											onDraftChange(
												"rating",
												event.target.value,
											)
										}
										type="number"
										step="0.1"
									/>
								) : (
									<div className="admin-readonly">
										{restaurant.rating ?? "-"}
									</div>
								)}
							</DetailField>
							<DetailField label="지역">
								{isEditMode ? (
									<select
										value={draft.region}
										onChange={(event) =>
											onDraftChange(
												"region",
												event.target.value,
											)
										}
									>
										{categoryOptions.map((region) => (
											<option key={region} value={region}>
												{region}
											</option>
										))}
									</select>
								) : (
									<div className="admin-readonly">
										{restaurant.region}
									</div>
								)}
							</DetailField>
							<DetailField label="가격 레벨">
								{isEditMode ? (
									<select
										value={draft.priceLevel}
										onChange={(event) =>
											onDraftChange(
												"priceLevel",
												event.target.value,
											)
										}
									>
										{PRICE_LEVEL_OPTIONS.map(
											(priceLevel) => (
												<option
													key={priceLevel}
													value={priceLevel}
												>
													{priceLevel}
												</option>
											),
										)}
									</select>
								) : (
									<div className="admin-readonly">
										{restaurant.priceLevel}
									</div>
								)}
							</DetailField>
							<DetailField label="추천 시간대">
								{isEditMode ? (
									<select
										value={draft.timeSlot}
										onChange={(event) =>
											onDraftChange(
												"timeSlot",
												event.target.value,
											)
										}
									>
										{TIME_SLOT_OPTIONS.map((timeSlot) => (
											<option
												key={timeSlot}
												value={timeSlot}
											>
												{timeSlot}
											</option>
										))}
									</select>
								) : (
									<div className="admin-readonly">
										{restaurant.timeSlot}
									</div>
								)}
							</DetailField>
						</div>
						<div className="admin-detail-meta">
							<span>
								생성일: {formatTimestamp(restaurant.createdAt)}
							</span>
							<span>
								수정일: {formatTimestamp(restaurant.updatedAt)}
							</span>
						</div>
					</DetailSection>

					<DetailSection
						title="링크 및 위치"
						description="지도/이미지 링크와 좌표 정보를 확인합니다."
					>
						<div className="admin-detail-grid">
							<DetailField label="지도 URL">
								{isEditMode ? (
									<input
										value={draft.mapUrl}
										onChange={(event) =>
											onDraftChange(
												"mapUrl",
												event.target.value,
											)
										}
									/>
								) : (
									<div className="admin-readonly">
										{restaurant.mapUrl.trim() ? (
											<a
												href={restaurant.mapUrl}
												target="_blank"
												rel="noreferrer"
												className="admin-readonly-link"
											>
												{restaurant.mapUrl}
											</a>
										) : (
											"-"
										)}
									</div>
								)}
							</DetailField>
							<DetailField label="이미지 URL">
								{isEditMode ? (
									<input
										value={draft.imageUrl}
										onChange={(event) =>
											onDraftChange(
												"imageUrl",
												event.target.value,
											)
										}
									/>
								) : (
									<div className="admin-readonly">
										{restaurant.imageUrl.trim() ? (
											<a
												href={restaurant.imageUrl}
												target="_blank"
												rel="noreferrer"
												className="admin-readonly-link"
											>
												{restaurant.imageUrl}
											</a>
										) : (
											"-"
										)}
									</div>
								)}
							</DetailField>
							<DetailField label="경도 (longitude)">
								{isEditMode ? (
									<input
										value={draft.longitude}
										onChange={(event) =>
											onDraftChange(
												"longitude",
												event.target.value,
											)
										}
										type="number"
										step="0.000001"
									/>
								) : (
									<div className="admin-readonly">
										{restaurant.location?.coordinates[0] ??
											"-"}
									</div>
								)}
							</DetailField>
							<DetailField label="위도 (latitude)">
								{isEditMode ? (
									<input
										value={draft.latitude}
										onChange={(event) =>
											onDraftChange(
												"latitude",
												event.target.value,
											)
										}
										type="number"
										step="0.000001"
									/>
								) : (
									<div className="admin-readonly">
										{restaurant.location?.coordinates[1] ??
											"-"}
									</div>
								)}
							</DetailField>
						</div>
					</DetailSection>

					<DetailSection
						title="추천 근거"
						description="메뉴와 리뷰 관련 정량 데이터입니다."
					>
						<div className="admin-detail-grid">
							<DetailField label="대표 메뉴">
								{isEditMode ? (
									<input
										value={draft.representMenu}
										onChange={(event) =>
											onDraftChange(
												"representMenu",
												event.target.value,
											)
										}
									/>
								) : (
									<div className="admin-readonly">
										{restaurant.representMenu}
									</div>
								)}
							</DetailField>
							<DetailField label="대표 메뉴 가격">
								{isEditMode ? (
									<input
										value={draft.representMenuPrice}
										onChange={(event) =>
											onDraftChange(
												"representMenuPrice",
												event.target.value,
											)
										}
										type="number"
									/>
								) : (
									<div className="admin-readonly">
										{restaurant.representMenuPrice ?? "-"}
									</div>
								)}
							</DetailField>
							<DetailField label="리뷰 수">
								{isEditMode ? (
									<input
										value={draft.reviewCount}
										onChange={(event) =>
											onDraftChange(
												"reviewCount",
												event.target.value,
											)
										}
										type="number"
									/>
								) : (
									<div className="admin-readonly">
										{restaurant.reviewCount ?? "-"}
									</div>
								)}
							</DetailField>
							<DetailField label="블로그 리뷰 수">
								{isEditMode ? (
									<input
										value={draft.blogReviewCount}
										onChange={(event) =>
											onDraftChange(
												"blogReviewCount",
												event.target.value,
											)
										}
										type="number"
									/>
								) : (
									<div className="admin-readonly">
										{restaurant.blogReviewCount ?? "-"}
									</div>
								)}
							</DetailField>
						</div>
					</DetailSection>

					<DetailSection
						title="콘텐츠 요약"
						description="리뷰 원문, 설명, AI 요약을 확인합니다."
					>
						<div className="admin-detail-stack">
							<DetailField label="대표 리뷰">
								{isEditMode ? (
									<textarea
										value={draft.representativeReview}
										onChange={(event) =>
											onDraftChange(
												"representativeReview",
												event.target.value,
											)
										}
										rows={3}
									/>
								) : (
									<div className="admin-readonly admin-readonly--multiline">
										{restaurant.representativeReview}
									</div>
								)}
							</DetailField>
							<DetailField label="설명">
								{isEditMode ? (
									<textarea
										value={draft.description}
										onChange={(event) =>
											onDraftChange(
												"description",
												event.target.value,
											)
										}
										rows={4}
									/>
								) : (
									<div className="admin-readonly admin-readonly--multiline">
										{restaurant.description}
									</div>
								)}
							</DetailField>
							<DetailField label="AI 요약 제목">
								{isEditMode ? (
									<input
										value={draft.aiMateSummaryTitle}
										onChange={(event) =>
											onDraftChange(
												"aiMateSummaryTitle",
												event.target.value,
											)
										}
									/>
								) : (
									<div className="admin-readonly">
										{restaurant.aiMateSummaryTitle}
									</div>
								)}
							</DetailField>
							<DetailField label="AI 요약 본문 (줄바꿈 구분)">
								{isEditMode ? (
									<textarea
										value={draft.aiMateSummaryContents}
										onChange={(event) =>
											onDraftChange(
												"aiMateSummaryContents",
												event.target.value,
											)
										}
										rows={4}
									/>
								) : (
									<div className="admin-readonly admin-readonly--multiline">
										{restaurant.aiMateSummaryContents.join(
											"\n",
										)}
									</div>
								)}
							</DetailField>
						</div>
					</DetailSection>
				</div>
			</section>

			{toastMessage ? (
				<div className="admin-toast">
					<Toast message={toastMessage} />
				</div>
			) : null}
		</main>
	);
}
