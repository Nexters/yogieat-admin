import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { getAdminServiceMode } from "#/apis/admin";
import {
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
	} = useRestaurantListPage();

	const accessToken = session?.tokenBundle?.accessToken?.trim();
	const isMockSession = Boolean(accessToken?.startsWith("mock-"));
	const showApiMode = isAuthenticated && getAdminServiceMode() === "mock";
	const shouldShowMockMode = showApiMode && isMockSession;

	const handleLogout = async () => {
		await logout();
		navigate("/login", { replace: true });
	};

	return (
		<main className="admin-shell">
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
							onClick={handleLogout}
						>
							로그아웃
						</Button>
					</>
				}
			/>

			<section className="admin-panel">
				<RestaurantListControls
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

				<RestaurantListContent
					errorMessage={errorMessage}
					handleImageError={handleImageError}
					imageErrorById={imageErrorById}
					isLoading={isLoading}
					onNavigateDetail={(restaurantId) =>
						navigate(`/restaurants/${restaurantId}`, {
							state: {
								from: `${location.pathname}${location.search}`,
							},
						})
					}
					restaurants={pageResponse.content}
				/>

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
