import React from "react";

import type { CategoryOption, RestaurantDetail } from "#/apis/restaurants";
import { CategoryPicker } from "#/pageComponents/restaurants/detail/components";
import {
	formatTimestamp,
	PRICE_LEVEL_OPTIONS,
	TIME_SLOT_OPTIONS,
} from "#/pageComponents/restaurants/detail/constants";
import { DetailField } from "#/pageComponents/restaurants/detail/DetailField";
import { DetailSection } from "#/pageComponents/restaurants/detail/DetailSection";
import type {
	CategoryGroup,
	DraftChangeHandler,
	EditableRestaurant,
} from "#/pageComponents/restaurants/detail/types";
import {
	toRegionLabel,
	toTimeSlotLabel,
} from "#/shared/constants/DomainLabels";

type BasicInfoSectionProps = {
	activeLargeCategory?: string;
	categoryGroups: CategoryGroup[];
	categoryKeyword: string;
	filteredMediumCategories: CategoryOption[];
	isEditMode: boolean;
	onCategoryKeywordChange: (value: string) => void;
	onClearCategory: () => void;
	onDraftChange: DraftChangeHandler;
	onLargeCategoryChange: (largeCategory: string) => void;
	onSelectCategory: (categoryId: number) => void;
	draft: EditableRestaurant;
	regionOptions: string[];
	restaurant: RestaurantDetail;
	selectedCategory?: CategoryOption;
	selectedCategoryInDraft?: CategoryOption;
	toCategoryLabel: (category: CategoryOption) => string;
};

export function BasicInfoSection({
	activeLargeCategory,
	categoryGroups,
	categoryKeyword,
	filteredMediumCategories,
	isEditMode,
	onCategoryKeywordChange,
	onClearCategory,
	onDraftChange,
	onLargeCategoryChange,
	onSelectCategory,
	draft,
	regionOptions,
	restaurant,
	selectedCategory,
	selectedCategoryInDraft,
	toCategoryLabel,
}: BasicInfoSectionProps) {
	return (
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
								onDraftChange("externalId", event.target.value)
							}
						/>
					) : (
						<div className="admin-readonly">
							{restaurant.externalId}
						</div>
					)}
				</DetailField>
				<DetailField label="카테고리" className="admin-field--full">
					{isEditMode ? (
						<CategoryPicker
							activeLargeCategory={activeLargeCategory}
							categoryGroups={categoryGroups}
							categoryKeyword={categoryKeyword}
							filteredMediumCategories={filteredMediumCategories}
							onCategoryKeywordChange={onCategoryKeywordChange}
							onClearCategory={onClearCategory}
							onLargeCategoryChange={onLargeCategoryChange}
							onSelectCategory={onSelectCategory}
							selectedCategory={selectedCategoryInDraft}
							toCategoryLabel={toCategoryLabel}
						/>
					) : (
						<div className="admin-readonly">
							{selectedCategory
								? toCategoryLabel(selectedCategory)
								: (restaurant.categoryId ?? "-")}
						</div>
					)}
				</DetailField>
				<DetailField label="이름">
					{isEditMode ? (
						<input
							value={draft.name}
							onChange={(event) =>
								onDraftChange("name", event.target.value)
							}
						/>
					) : (
						<div className="admin-readonly">{restaurant.name}</div>
					)}
				</DetailField>
				<DetailField label="주소">
					{isEditMode ? (
						<input
							value={draft.address}
							onChange={(event) =>
								onDraftChange("address", event.target.value)
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
								onDraftChange("rating", event.target.value)
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
								onDraftChange("region", event.target.value)
							}
						>
							{regionOptions.map((region) => (
								<option key={region} value={region}>
									{toRegionLabel(region)}
								</option>
							))}
						</select>
					) : (
						<div className="admin-readonly">
							{toRegionLabel(restaurant.region)}
						</div>
					)}
				</DetailField>
				<DetailField label="가격 레벨">
					{isEditMode ? (
						<select
							value={draft.priceLevel}
							onChange={(event) =>
								onDraftChange("priceLevel", event.target.value)
							}
						>
							{PRICE_LEVEL_OPTIONS.map((priceLevel) => (
								<option key={priceLevel} value={priceLevel}>
									{priceLevel}
								</option>
							))}
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
								onDraftChange("timeSlot", event.target.value)
							}
						>
							{TIME_SLOT_OPTIONS.map((timeSlot) => (
								<option key={timeSlot} value={timeSlot}>
									{toTimeSlotLabel(timeSlot)}
								</option>
							))}
						</select>
					) : (
						<div className="admin-readonly">
							{toTimeSlotLabel(restaurant.timeSlot)}
						</div>
					)}
				</DetailField>
			</div>
			<div className="admin-detail-meta">
				<span>생성일: {formatTimestamp(restaurant.createdAt)}</span>
				<span>수정일: {formatTimestamp(restaurant.updatedAt)}</span>
			</div>
		</DetailSection>
	);
}
