import React from "react";

import type { RestaurantDetail } from "#/apis/restaurants";
import { DetailField } from "#/pageComponents/restaurants/detail/DetailField";
import { DetailSection } from "#/pageComponents/restaurants/detail/DetailSection";
import type {
	DraftChangeHandler,
	EditableRestaurant,
} from "#/pageComponents/restaurants/detail/types";

type ContentSectionProps = {
	isEditMode: boolean;
	onDraftChange: DraftChangeHandler;
	draft: EditableRestaurant;
	restaurant: RestaurantDetail;
};

export function ContentSection({
	isEditMode,
	onDraftChange,
	draft,
	restaurant,
}: ContentSectionProps) {
	return (
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
								onDraftChange("description", event.target.value)
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
							{restaurant.aiMateSummaryContents.join("\n")}
						</div>
					)}
				</DetailField>
			</div>
		</DetailSection>
	);
}
