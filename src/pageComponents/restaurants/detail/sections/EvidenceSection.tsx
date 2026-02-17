import React from "react";

import type { RestaurantDetail } from "#/apis/restaurants";
import { DetailField } from "#/pageComponents/restaurants/detail/DetailField";
import { DetailSection } from "#/pageComponents/restaurants/detail/DetailSection";
import type {
	DraftChangeHandler,
	EditableRestaurant,
} from "#/pageComponents/restaurants/detail/types";

type EvidenceSectionProps = {
	isEditMode: boolean;
	onDraftChange: DraftChangeHandler;
	draft: EditableRestaurant;
	restaurant: RestaurantDetail;
};

export function EvidenceSection({
	isEditMode,
	onDraftChange,
	draft,
	restaurant,
}: EvidenceSectionProps) {
	return (
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
								onDraftChange("reviewCount", event.target.value)
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
	);
}
