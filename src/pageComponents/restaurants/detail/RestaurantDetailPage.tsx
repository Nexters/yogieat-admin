import React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import { NotFoundPage } from "#/pageComponents/common";
import { DetailImagePanel } from "#/pageComponents/restaurants/detail/components";
import { useRestaurantDetailPage } from "#/pageComponents/restaurants/detail/hooks/useRestaurantDetailPage";
import {
	BasicInfoSection,
	ContentSection,
	EvidenceSection,
	LocationSection,
} from "#/pageComponents/restaurants/detail/sections";
import {
	AdminTopbar,
	Button,
	Toast,
} from "#/shared/ui";

type RestaurantDetailNavigateState = {
	from?: string;
	fromQuery?: {
		page?: number;
		size?: number;
		keyword?: string;
		region?: string;
		largeCategory?: string;
		categoryId?: number;
	};
};

const toSafeQueryValue = (value: unknown) => {
	if (typeof value === "string") {
		const trimmed = value.trim();
		return trimmed.length > 0 ? trimmed : undefined;
	}

	return undefined;
};

const toSafePositiveInteger = (value: unknown) => {
	if (typeof value !== "number" || !Number.isFinite(value)) {
		return undefined;
	}

	return Number.isInteger(value) && value >= 0 ? value : undefined;
};

const buildRestaurantListPathFromQuery = (
	query:
		| RestaurantDetailNavigateState["fromQuery"]
		| undefined,
): string => {
	const search = new URLSearchParams();
	const page = toSafePositiveInteger(query?.page);
	const size = toSafePositiveInteger(query?.size);

	search.set("page", String(page ?? 0));
	if (size) {
		search.set("size", String(size));
	}

	const keyword = toSafeQueryValue(query?.keyword);
	const region = toSafeQueryValue(query?.region);
	const largeCategory = toSafeQueryValue(query?.largeCategory);
	const categoryId = toSafePositiveInteger(query?.categoryId);

	if (keyword) {
		search.set("keyword", keyword);
	}
	if (region) {
		search.set("region", region);
	}
	if (largeCategory) {
		search.set("largeCategory", largeCategory);
	}
	if (typeof categoryId === "number") {
		search.set("categoryId", String(categoryId));
	}

	const queryString = search.toString();
	return queryString ? `/restaurants?${queryString}` : "/restaurants";
};

export function RestaurantDetailPage() {
	const navigate = useNavigate();
	const location = useLocation();
	const { restaurantId: restaurantIdParam } = useParams();
	const restaurantId = Number(restaurantIdParam);
	const hasValidId = Number.isFinite(restaurantId) && restaurantId > 0;
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
	const state = location.state as RestaurantDetailNavigateState | undefined;
	const returnTo = state?.from?.startsWith("/restaurants")
		? state.from
		: buildRestaurantListPathFromQuery(state?.fromQuery);
	const handleGoList = () => {
		navigate(returnTo, { replace: true });
	};

	const {
		activeCategoryGroup,
		categoryGroups,
		categoryKeyword,
		detailImageSrc,
		draft,
		handleDeleteRestaurant,
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
		isDeletingRestaurant,
		isSyncing,
		loadErrorMessage,
		onDraftChange,
		regionOptions,
		restaurant,
		selectedCategoryInDraft,
		selectedCategoryLabel,
		setActiveLargeCategory,
		setCategoryId,
		setCategoryKeyword,
		setIsDetailImageError,
		toastMessage,
		toCategoryLabel,
	} = useRestaurantDetailPage({
		hasValidId,
		restaurantId,
		onRestaurantDeleted: handleGoList,
	});

	const openDeleteDialog = () => {
		if (!restaurant) {
			return;
		}
		setIsDeleteDialogOpen(true);
	};

	const handleDeleteConfirm = async () => {
		await handleDeleteRestaurant();
		setIsDeleteDialogOpen(false);
	};

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
				description={
					loadErrorMessage ||
					"삭제되었거나 접근 권한이 없는 데이터일 수 있습니다."
				}
			/>
		);
	}

	return (
		<main className="admin-shell">
			<AdminTopbar
				eyebrow="Restaurant Detail"
				title={restaurant.name}
				actionsClassName="admin-topbar__actions--detail"
				actions={
					<>
						<Button
							variant="inverse"
							size="sm"
							onClick={handleGoList}
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
						<Button
							variant="inverse"
							size="sm"
							onClick={() => navigate("/regions")}
						>
							지역 관리
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
							variant="tertiary"
							loading={isDeletingRestaurant}
							onClick={openDeleteDialog}
						>
							삭제
						</Button>
						<Button
							size="sm"
							variant="primary"
							loading={isSyncing}
							disabled={isSaving}
							onClick={handleSync}
						>
							단일 동기화
						</Button>
					</>
				}
			/>

			<section className="admin-panel admin-panel--detail">
				<DetailImagePanel
					hasImage={hasDetailImage}
					imageSrc={detailImageSrc}
					onImageError={() => setIsDetailImageError(true)}
					restaurantName={restaurant.name}
				/>

				{errorMessage ? (
					<p className="admin-error" role="alert">
						{errorMessage}
					</p>
				) : null}

				<div className="admin-detail-sections">
					<BasicInfoSection
						activeLargeCategory={activeCategoryGroup?.largeCategory}
						categoryGroups={categoryGroups}
						categoryKeyword={categoryKeyword}
						filteredMediumCategories={filteredMediumCategories}
						isEditMode={isEditMode}
						onCategoryKeywordChange={setCategoryKeyword}
						onClearCategory={() => setCategoryId(null)}
						onDraftChange={onDraftChange}
						onLargeCategoryChange={setActiveLargeCategory}
							onSelectCategory={setCategoryId}
							draft={draft}
							regionOptions={regionOptions}
							restaurant={restaurant}
							selectedCategoryInDraft={selectedCategoryInDraft}
							selectedCategoryLabel={selectedCategoryLabel}
							toCategoryLabel={toCategoryLabel}
						/>
					<LocationSection
						isEditMode={isEditMode}
						onDraftChange={onDraftChange}
						draft={draft}
						restaurant={restaurant}
					/>
					<EvidenceSection
						isEditMode={isEditMode}
						onDraftChange={onDraftChange}
						draft={draft}
						restaurant={restaurant}
					/>
					<ContentSection
						isEditMode={isEditMode}
						onDraftChange={onDraftChange}
						draft={draft}
						restaurant={restaurant}
					/>
				</div>
			</section>

			{toastMessage ? (
				<div className="admin-toast">
					<Toast message={toastMessage} />
				</div>
			) : null}

				{isDeleteDialogOpen ? (
					<div
						className="admin-confirm-modal__overlay"
						onClick={(event) => {
							if (event.target === event.currentTarget) {
								setIsDeleteDialogOpen(false);
							}
						}}
						role="presentation"
					>
							<div className="admin-confirm-modal__content">
									<h3>맛집 삭제</h3>
									<p className="admin-confirm-modal__description">
										<strong>{`"${restaurant?.name}"`}</strong>
										{` 맛집을 삭제하시겠습니까?`}
										<span className="admin-confirm-modal__warning">
											삭제하면 복구할 수 없습니다.
										</span>
									</p>
							<div className="admin-confirm-modal__buttons">
								<Button
									size="sm"
									variant="secondary"
									type="button"
									onClick={() => setIsDeleteDialogOpen(false)}
									disabled={isDeletingRestaurant}
								>
									취소
								</Button>
								<Button
									size="sm"
									variant="tertiary"
									loading={isDeletingRestaurant}
									onClick={handleDeleteConfirm}
									disabled={isDeletingRestaurant}
								>
									삭제
								</Button>
							</div>
						</div>
					</div>
				) : null}
			</main>
		);
	}
