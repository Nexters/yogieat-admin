import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { getAdminServiceMode } from "#/apis/admin";
import {
	RestaurantCreatePanel,
	RestaurantListContent,
	RestaurantListControls,
	RestaurantPagination,
} from "#/pageComponents/restaurants/list/components";
import { useRestaurantListPage } from "#/pageComponents/restaurants/list/hooks/useRestaurantListPage";
import { useAuth } from "#/providers";
import { AdminTopbar, Button, Toast } from "#/shared/ui";

export function RestaurantListPage() {
	const navigate = useNavigate();
	const location = useLocation();
	const { isAuthenticated, session, logout } = useAuth();
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
	const [deleteTargetRestaurantName, setDeleteTargetRestaurantName] =
		React.useState("");
	const [deleteTargetRestaurantId, setDeleteTargetRestaurantId] =
		React.useState<number>(0);

	const {
		applySearch,
		errorMessage,
		handleImageError,
		handlePageInputChange,
		handleLargeCategoryChange,
		handlePageMove,
		handlePageSubmit,
		handleRegionChange,
		handleSyncAll,
		imageErrorById,
		isLoading,
		isSyncingAll,
		pageInputText,
		keywordInput,
		largeCategoryOptions,
		pageResponse,
		query,
		regionOptions,
		setKeywordInput,
		toastMessage,
		createSearchInput,
		searchErrorMessage,
		createSearchItems,
		handleCreateCategoryChange,
		handleCreatePanelToggle,
		handleCreateRegionChange,
		handleCreateDescriptionChange,
		handleCreateRestaurant,
		handleCreateRestaurantSelect,
		handleCreateSearchInputChange,
		handleCreateSearchSubmit,
		isCreatePanelOpen,
		isCreateRestaurantLoading,
		isSearchLoading,
		categoryOptions,
		canCreateRestaurant,
		selectedCreateCategoryId,
		selectedCreateExternalId,
		selectedCreateRegion,
		selectedCreateDescription,
		regions,
		isSearched,
		handleDeleteRestaurant,
		isDeletingRestaurant,
		deletingRestaurantId,
	} = useRestaurantListPage();

	const accessToken = session?.tokenBundle?.accessToken?.trim();
	const isMockSession = Boolean(accessToken?.startsWith("mock-"));
	const showApiMode = isAuthenticated && getAdminServiceMode() === "mock";
	const shouldShowMockMode = showApiMode && isMockSession;

	const handleLogout = async () => {
		await logout();
		navigate("/login", { replace: true });
	};

	const navigateToRestaurantDetail = (restaurantId: number) => {
		navigate(`/restaurants/${restaurantId}`, {
			state: {
				from: `${location.pathname}${location.search}`,
				fromQuery: query,
			},
		});
	};

	const openDeleteDialog = (restaurantId: number, restaurantName: string) => {
		setDeleteTargetRestaurantId(restaurantId);
		setDeleteTargetRestaurantName(restaurantName);
		setIsDeleteDialogOpen(true);
		return Promise.resolve();
	};

	const closeDeleteDialog = () => {
		setIsDeleteDialogOpen(false);
	};

	const confirmDeleteRestaurant = async () => {
		await handleDeleteRestaurant(
			deleteTargetRestaurantId,
			deleteTargetRestaurantName,
		);
		closeDeleteDialog();
	};

	return (
		<main className="admin-shell admin-restaurants-page">
			<AdminTopbar
				eyebrow="관리자 페이지"
				title="맛집 관리"
				subtitle={shouldShowMockMode ? "API Mode: MOCK" : undefined}
				actionsClassName="admin-topbar__actions--list"
				actions={
					<>
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
						<Button
							variant="inverse"
							size="sm"
							onClick={handleLogout}
						>
							로그아웃
						</Button>
					</>
				}
			/>

			<section className="admin-panel">
				<RestaurantListControls
					isCreatePanelOpen={isCreatePanelOpen}
					onToggleCreatePanel={handleCreatePanelToggle}
					handleLargeCategoryChange={handleLargeCategoryChange}
					handleRegionChange={handleRegionChange}
					handleSyncAll={handleSyncAll}
					isSyncingAll={isSyncingAll}
					keywordInput={keywordInput}
					largeCategoryOptions={largeCategoryOptions}
					onKeywordInputChange={setKeywordInput}
					onSearchSubmit={applySearch}
					query={query}
					regionOptions={regionOptions}
				/>

				{isCreatePanelOpen ? (
					<RestaurantCreatePanel
						categories={categoryOptions}
						canCreate={canCreateRestaurant}
						hasSearched={isSearched}
						isCreating={isCreateRestaurantLoading}
						isSearchLoading={isSearchLoading}
						onCategoryChange={handleCreateCategoryChange}
						onCreateSubmit={handleCreateRestaurant}
						onRegionChange={handleCreateRegionChange}
						onDescriptionChange={handleCreateDescriptionChange}
						onSearchInputChange={handleCreateSearchInputChange}
						onSearchSubmit={handleCreateSearchSubmit}
						onSelectRestaurant={handleCreateRestaurantSelect}
						regions={regions}
						searchErrorMessage={searchErrorMessage}
						searchItems={createSearchItems}
						searchKeywordInput={createSearchInput}
						selectedCategoryId={selectedCreateCategoryId}
						selectedExternalId={selectedCreateExternalId}
						selectedRegion={selectedCreateRegion}
						selectedDescription={selectedCreateDescription}
					/>
				) : null}

				<RestaurantListContent
					errorMessage={errorMessage}
					handleImageError={handleImageError}
					imageErrorById={imageErrorById}
					isLoading={isLoading}
					deletingRestaurantId={deletingRestaurantId}
					onNavigateDetail={navigateToRestaurantDetail}
					onDeleteRestaurant={openDeleteDialog}
					restaurants={pageResponse.content}
				/>

				{isDeleteDialogOpen ? (
					<div
						className="admin-confirm-modal__overlay"
						onClick={(event) => {
							if (event.target === event.currentTarget) {
								closeDeleteDialog();
							}
						}}
						role="presentation"
					>
								<div className="admin-confirm-modal__content">
											<h3>맛집 삭제</h3>
											<p className="admin-confirm-modal__description">
												<strong>{`"${deleteTargetRestaurantName}"`}</strong>
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
									onClick={closeDeleteDialog}
									disabled={isDeletingRestaurant}
								>
									취소
								</Button>
								<Button
									size="sm"
									variant="tertiary"
									loading={isDeletingRestaurant}
									onClick={confirmDeleteRestaurant}
									disabled={isDeletingRestaurant}
								>
									삭제
								</Button>
							</div>
						</div>
					</div>
				) : null}

				<RestaurantPagination
					pageInputText={pageInputText}
					onPageInputChange={handlePageInputChange}
					isLoading={isLoading}
					onMoveToPage={handlePageSubmit}
					onMovePage={handlePageMove}
					page={query.page}
					pageResponse={pageResponse}
				/>
			</section>

			{toastMessage ? (
				<div className="admin-toast">
					<Toast message={toastMessage} />
				</div>
			) : null}
		</main>
	);
}
