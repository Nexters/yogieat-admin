import React from "react";

import type { CategoryOption } from "#/apis/restaurants";
import type { CategoryGroup } from "#/pageComponents/restaurants/detail/types";
import { toLargeCategoryLabel } from "#/shared/constants/domain-labels";
import { Button } from "#/shared/ui";

type CategoryPickerProps = {
	activeLargeCategory?: string;
	categoryGroups: CategoryGroup[];
	categoryKeyword: string;
	filteredMediumCategories: CategoryOption[];
	onCategoryKeywordChange: (value: string) => void;
	onClearCategory: () => void;
	onLargeCategoryChange: (largeCategory: string) => void;
	onSelectCategory: (categoryId: number) => void;
	selectedCategory?: CategoryOption;
	toCategoryLabel: (category: CategoryOption) => string;
};

export function CategoryPicker({
	activeLargeCategory,
	categoryGroups,
	categoryKeyword,
	filteredMediumCategories,
	onCategoryKeywordChange,
	onClearCategory,
	onLargeCategoryChange,
	onSelectCategory,
	selectedCategory,
	toCategoryLabel,
}: CategoryPickerProps) {
	return (
		<div className="admin-category-picker">
			<div className="admin-category-dropzone">
				<p className="admin-category-dropzone__title">
					선택된 카테고리
				</p>
				{selectedCategory ? (
					<div className="admin-category-token">
						{toCategoryLabel(selectedCategory)}
					</div>
				) : (
					<p className="admin-category-dropzone__placeholder">
						대 카테고리를 선택한 뒤 아래 목록을 스크롤해 세부
						카테고리를 선택해 주세요.
					</p>
				)}
				<Button size="sm" variant="tertiary" onClick={onClearCategory}>
					카테고리 해제
				</Button>
			</div>
			<div className="admin-category-browser">
				<div className="admin-category-group-tabs scrollbar-hide">
					{categoryGroups.map((group) => {
						const isActive =
							group.largeCategory === activeLargeCategory;

						return (
							<button
								type="button"
								key={group.largeCategory}
								className={`admin-category-group-tab${
									isActive
										? " admin-category-group-tab--active"
										: ""
								}`}
							onClick={() =>
									onLargeCategoryChange(group.largeCategory)
								}
							>
								{toLargeCategoryLabel(group.largeCategory)}
								<span>({group.items.length})</span>
							</button>
						);
					})}
				</div>
				<div className="admin-category-search">
					<input
						type="text"
						value={categoryKeyword}
						onChange={(event) =>
							onCategoryKeywordChange(event.target.value)
						}
						placeholder="세부 카테고리 검색"
						aria-label="세부 카테고리 검색"
					/>
					<span>{filteredMediumCategories.length}개</span>
				</div>
				<ul className="admin-category-medium-list">
					{filteredMediumCategories.map((category) => {
						const isSelected = selectedCategory?.id === category.id;
						const mediumName =
							category.mediumCategory ?? category.name;
						return (
							<li key={category.id}>
								<button
									type="button"
									className={`admin-category-medium-item${
										isSelected
											? " admin-category-medium-item--selected"
											: ""
									}`}
									onClick={() =>
										onSelectCategory(category.id)
									}
								>
									<span className="admin-category-medium-item__name">
										{mediumName}
									</span>
								</button>
							</li>
						);
					})}
					{!filteredMediumCategories.length ? (
						<li>
							<p className="admin-category-empty">
								{categoryKeyword.trim()
									? "검색 결과가 없습니다."
									: "카테고리가 없습니다."}
							</p>
						</li>
					) : null}
				</ul>
			</div>
		</div>
	);
}
