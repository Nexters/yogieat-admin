import React from "react";
import { useNavigate, useParams } from "react-router-dom";

import { NotFoundPage } from "#/pageComponents/common";
import { DetailImagePanel } from "#/pageComponents/restaurants/detail/components";
import { useRestaurantDetailPage } from "#/pageComponents/restaurants/detail/hooks/useRestaurantDetailPage";
import {
	BasicInfoSection,
	ContentSection,
	EvidenceSection,
	LocationSection,
} from "#/pageComponents/restaurants/detail/sections";
import { AdminTopbar, Button, Toast } from "#/shared/ui";

export function RestaurantDetailPage() {
	const navigate = useNavigate();
	const { restaurantId: restaurantIdParam } = useParams();
	const restaurantId = Number(restaurantIdParam);
	const hasValidId = Number.isFinite(restaurantId) && restaurantId > 0;

	const {
		activeCategoryGroup,
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
		toCategoryLabel,
	} = useRestaurantDetailPage({
		hasValidId,
		restaurantId,
	});

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
						selectedCategory={selectedCategory}
						selectedCategoryInDraft={selectedCategoryInDraft}
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
		</main>
	);
}
