import React, { FormEvent } from "react";

import type { RestaurantListQuery } from "#/apis/restaurants";
import {
	ALL_FILTER_VALUE,
	toLargeCategoryFilterLabel,
	toRegionFilterLabel,
} from "#/shared/constants/DomainLabels";
import { Button } from "#/shared/ui";

type RestaurantListControlsProps = {
	handleLargeCategoryChange: (category: string) => void;
	handleRegionChange: (region: string) => void;
	handleSyncAll: () => Promise<void>;
	isSyncingAll: boolean;
	keywordInput: string;
	largeCategoryOptions: string[];
	onKeywordInputChange: (value: string) => void;
	onSearchSubmit: () => void;
	query: RestaurantListQuery;
	regionOptions: string[];
};

export function RestaurantListControls({
	handleLargeCategoryChange,
	handleRegionChange,
	handleSyncAll,
	isSyncingAll,
	keywordInput,
	largeCategoryOptions,
	onKeywordInputChange,
	onSearchSubmit,
	query,
	regionOptions,
}: RestaurantListControlsProps) {
	const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		onSearchSubmit();
	};

	return (
		<div className="admin-panel__controls">
			<form className="admin-search-form" onSubmit={handleSubmit}>
				<input
					value={keywordInput}
					onChange={(event) =>
						onKeywordInputChange(event.target.value)
					}
					placeholder="맛집명, 주소, 설명으로 검색"
					aria-label="검색어"
				/>
				<Button size="sm" type="submit">
					검색
				</Button>
			</form>
			<div className="admin-filters admin-filters--inline">
				<label>
					<span>지역</span>
					<select
						value={query.region ?? ALL_FILTER_VALUE}
						onChange={(event) =>
							handleRegionChange(event.target.value)
						}
					>
						{regionOptions.map((region) => (
							<option key={region} value={region}>
								{toRegionFilterLabel(region)}
							</option>
						))}
					</select>
				</label>
				<label>
					<span>카테고리</span>
					<select
						value={query.largeCategory ?? ALL_FILTER_VALUE}
						onChange={(event) =>
							handleLargeCategoryChange(event.target.value)
						}
					>
						{largeCategoryOptions.map((largeCategory) => (
							<option key={largeCategory} value={largeCategory}>
								{toLargeCategoryFilterLabel(largeCategory)}
							</option>
						))}
					</select>
				</label>
			</div>
			<Button
				variant="primary"
				size="sm"
				loading={isSyncingAll}
				onClick={handleSyncAll}
			>
				전체 동기화
			</Button>
		</div>
	);
}
