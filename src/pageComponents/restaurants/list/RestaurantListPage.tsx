import React from "react";
import { useNavigate } from "react-router-dom";

import {
	RestaurantListContent,
	RestaurantListControls,
	RestaurantPagination,
} from "#/pageComponents/restaurants/list/components";
import { useRestaurantListPage } from "#/pageComponents/restaurants/list/hooks/useRestaurantListPage";
import { useAuth } from "#/providers";
import { APP_API_MODE } from "#/shared/config";
import { AdminTopbar, Button, Toast } from "#/shared/ui";

export function RestaurantListPage() {
	const navigate = useNavigate();
	const { logout } = useAuth();

	const {
		applySearch,
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
	} = useRestaurantListPage();

	const handleLogout = async () => {
		await logout();
		navigate("/login", { replace: true });
	};

	return (
		<main className="admin-shell">
			<AdminTopbar
				eyebrow="관리자 페이지"
				title="맛집 관리"
				subtitle={`API Mode: ${APP_API_MODE.toUpperCase()}`}
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
					categoryNameById={categoryNameById}
					errorMessage={errorMessage}
					handleImageError={handleImageError}
					imageErrorById={imageErrorById}
					isLoading={isLoading}
					onNavigateDetail={(restaurantId) =>
						navigate(`/restaurants/${restaurantId}`)
					}
					restaurants={pageResponse.content}
				/>

				<RestaurantPagination
					isLoading={isLoading}
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
