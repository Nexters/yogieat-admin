import React from "react";

import type { RestaurantDetail } from "#/apis/restaurants";
import { DetailField } from "#/pageComponents/restaurants/detail/DetailField";
import { DetailSection } from "#/pageComponents/restaurants/detail/DetailSection";
import type {
	DraftChangeHandler,
	EditableRestaurant,
} from "#/pageComponents/restaurants/detail/types";

type LocationSectionProps = {
	isEditMode: boolean;
	onDraftChange: DraftChangeHandler;
	draft: EditableRestaurant;
	restaurant: RestaurantDetail;
};

export function LocationSection({
	isEditMode,
	onDraftChange,
	draft,
	restaurant,
}: LocationSectionProps) {
	return (
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
								onDraftChange("mapUrl", event.target.value)
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
								onDraftChange("imageUrl", event.target.value)
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
								onDraftChange("longitude", event.target.value)
							}
							type="number"
							step="0.000001"
						/>
					) : (
						<div className="admin-readonly">
							{restaurant.location?.coordinates[0] ?? "-"}
						</div>
					)}
				</DetailField>
				<DetailField label="위도 (latitude)">
					{isEditMode ? (
						<input
							value={draft.latitude}
							onChange={(event) =>
								onDraftChange("latitude", event.target.value)
							}
							type="number"
							step="0.000001"
						/>
					) : (
						<div className="admin-readonly">
							{restaurant.location?.coordinates[1] ?? "-"}
						</div>
					)}
				</DetailField>
			</div>
		</DetailSection>
	);
}
