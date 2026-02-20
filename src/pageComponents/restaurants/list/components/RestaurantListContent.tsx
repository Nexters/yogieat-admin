import React from "react";

import type { RestaurantListItem } from "#/apis/restaurants";
import { RestaurantThumbnail } from "#/pageComponents/restaurants/list/components/RestaurantThumbnail";
import { toRegionLabel } from "#/shared/constants/DomainLabels";
import { toLargeCategoryLabel } from "#/shared/constants/DomainLabels";
import { Button } from "#/shared/ui";

const formatDateTime = (value: string) =>
	new Intl.DateTimeFormat("ko-KR", {
		month: "2-digit",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
		hour12: false,
	}).format(new Date(value));

const getCategoryLabel = (
	largeCategory?: string | null,
	mediumCategory?: string | null,
	categoryId?: number | null,
): string => {
	if (largeCategory?.trim() && mediumCategory?.trim()) {
		return `${toLargeCategoryLabel(
			largeCategory.trim(),
		)} / ${mediumCategory.trim()}`;
	}
	if (mediumCategory?.trim()) {
		return mediumCategory.trim();
	}
	if (largeCategory?.trim()) {
		return toLargeCategoryLabel(largeCategory.trim());
	}
	return categoryId === null || categoryId === undefined ? "-" : String(categoryId);
};

type RestaurantListContentProps = {
	errorMessage: string;
	handleImageError: (restaurantId: number) => void;
	imageErrorById: Record<number, true>;
	isLoading: boolean;
	onNavigateDetail: (restaurantId: number) => void;
	restaurants: RestaurantListItem[];
};

export function RestaurantListContent({
	errorMessage,
	handleImageError,
	imageErrorById,
	isLoading,
	onNavigateDetail,
	restaurants,
}: RestaurantListContentProps) {
	return (
		<>
			<div className="admin-table-wrap">
				<table className="admin-table">
					<thead>
						<tr>
							<th>ID</th>
							<th>이미지</th>
							<th>이름</th>
							<th>카테고리</th>
							<th>평점</th>
							<th>지역</th>
							<th>수정일</th>
							<th>상세</th>
						</tr>
					</thead>
					<tbody>
						{isLoading ? (
							<tr>
								<td colSpan={8} className="admin-table__status">
									목록을 불러오는 중입니다.
								</td>
							</tr>
						) : null}
						{!isLoading && errorMessage ? (
							<tr>
								<td colSpan={8} className="admin-table__status">
									{errorMessage}
								</td>
							</tr>
						) : null}
						{!isLoading &&
						!errorMessage &&
						restaurants.length === 0 ? (
							<tr>
								<td colSpan={8} className="admin-table__status">
									조건에 맞는 맛집이 없습니다.
								</td>
							</tr>
						) : null}
						{!isLoading &&
							!errorMessage &&
							restaurants.map((restaurant) => (
								<tr
									key={restaurant.id}
									onClick={() =>
										onNavigateDetail(restaurant.id)
									}
								>
									<td>{restaurant.id}</td>
									<td>
										<RestaurantThumbnail
											imageUrl={restaurant.imageUrl}
											isImageError={Boolean(
												imageErrorById[restaurant.id],
											)}
											onImageError={() =>
												handleImageError(restaurant.id)
											}
											restaurantName={restaurant.name}
											sizeClassName="admin-restaurant-thumb--table"
										/>
									</td>
									<td>{restaurant.name}</td>
									<td>
										{getCategoryLabel(
											restaurant.largeCategory,
											restaurant.mediumCategory,
											restaurant.categoryId,
										)}
									</td>
									<td>
										{restaurant.rating
											? restaurant.rating.toFixed(1)
											: "-"}
									</td>
									<td>{toRegionLabel(restaurant.region)}</td>
									<td>
										{formatDateTime(restaurant.updatedAt)}
									</td>
									<td>
										<Button
											size="sm"
											variant="tertiary"
											onClick={(event) => {
												event.stopPropagation();
												onNavigateDetail(restaurant.id);
											}}
										>
											상세
										</Button>
									</td>
								</tr>
							))}
					</tbody>
				</table>
			</div>

			<div className="admin-list-cards">
				{isLoading ? (
					<p className="admin-list-cards__status">
						목록을 불러오는 중입니다.
					</p>
				) : null}
				{!isLoading && errorMessage ? (
					<p className="admin-list-cards__status">{errorMessage}</p>
				) : null}
				{!isLoading && !errorMessage && restaurants.length === 0 ? (
					<p className="admin-list-cards__status">
						조건에 맞는 맛집이 없습니다.
					</p>
				) : null}
				{!isLoading &&
					!errorMessage &&
					restaurants.map((restaurant) => (
						<article
							key={`card-${restaurant.id}`}
							className="admin-restaurant-card"
						>
							<RestaurantThumbnail
								imageUrl={restaurant.imageUrl}
								isImageError={Boolean(
									imageErrorById[restaurant.id],
								)}
								onImageError={() =>
									handleImageError(restaurant.id)
								}
								restaurantName={restaurant.name}
								sizeClassName="admin-restaurant-thumb--card"
							/>
							<div className="admin-restaurant-card__header">
								<div>
									<h2>{restaurant.name}</h2>
									<p>ID: {restaurant.id}</p>
								</div>
								<Button
									size="sm"
									variant="secondary"
									onClick={() =>
										onNavigateDetail(restaurant.id)
									}
								>
									상세 보기
								</Button>
							</div>
							<div className="admin-restaurant-card__meta">
								<span>
									카테고리:{" "}
									{getCategoryLabel(
										restaurant.largeCategory,
										restaurant.mediumCategory,
										restaurant.categoryId,
									)}
								</span>
								<span>
									평점:{" "}
									{restaurant.rating
										? restaurant.rating.toFixed(1)
										: "-"}
								</span>
								<span>지역: {toRegionLabel(restaurant.region)}</span>
								<span>
									수정일:{" "}
									{formatDateTime(restaurant.updatedAt)}
								</span>
							</div>
						</article>
					))}
			</div>
		</>
	);
}
