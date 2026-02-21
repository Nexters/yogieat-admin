import React, { FormEvent } from "react";

import type {
	CategoryOption,
	RestaurantRegion,
	RestaurantSearchItem,
} from "#/apis/restaurants";
import { Button } from "#/shared/ui";

type RestaurantCreatePanelProps = {
	onSearchSubmit: () => void;
	onSearchInputChange: (value: string) => void;
	searchKeywordInput: string;
	isSearchLoading: boolean;
	searchErrorMessage: string;
	hasSearched: boolean;
	searchItems: RestaurantSearchItem[];
	onSelectRestaurant: (externalId: string) => void;
	selectedExternalId: string;
	categories: CategoryOption[];
	selectedCategoryId?: number;
	onCategoryChange: (categoryId: number | undefined) => void;
	regions: RestaurantRegion[];
	selectedRegion: string;
	onRegionChange: (region: string) => void;
	selectedDescription: string;
	onDescriptionChange: (description: string) => void;
	isCreating: boolean;
	onCreateSubmit: () => void;
	canCreate: boolean;
};

const DEFAULT_REGION_TEXT = "지역 선택";

export function RestaurantCreatePanel({
	onSearchSubmit,
	onSearchInputChange,
	searchKeywordInput,
	isSearchLoading,
	searchErrorMessage,
	hasSearched,
	searchItems,
	onSelectRestaurant,
	selectedExternalId,
	categories,
	selectedCategoryId,
	onCategoryChange,
	regions,
	selectedRegion,
	onRegionChange,
	selectedDescription,
	onDescriptionChange,
	isCreating,
	onCreateSubmit,
	canCreate,
}: RestaurantCreatePanelProps) {
	const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		onSearchSubmit();
	};

	return (
		<section className="admin-panel admin-panel--create">
			<header className="admin-panel__header">
				<h2>새 맛집 생성</h2>
				<p>카카오 검색 결과에서 맛집을 선택하고 지역/카테고리를 지정하세요.</p>
			</header>
			<form className="admin-search-form" onSubmit={handleSearchSubmit}>
				<input
					value={searchKeywordInput}
					onChange={(event) =>
						onSearchInputChange(event.target.value)
					}
					placeholder="키워드 검색"
					aria-label="카카오 맛집 검색"
				/>
				<Button size="sm" type="submit" loading={isSearchLoading}>
					검색
				</Button>
			</form>

			{searchErrorMessage ? (
				<p className="admin-form-error">{searchErrorMessage}</p>
			) : null}

			<div className="admin-create-results">
				{!hasSearched ? (
					<p className="admin-form-empty">검색어를 입력하고 검색해 주세요.</p>
				) : searchItems.length === 0 ? (
					<p className="admin-form-empty">
						검색 결과가 없습니다.
					</p>
				) : (
					searchItems.map((item) => {
						const isSelected = item.externalId === selectedExternalId;
						return (
							<button
								key={item.externalId}
								type="button"
								className={`admin-create-result-item${
									isSelected
										? " admin-create-result-item--active"
										: ""
								}`}
								onClick={() =>
									onSelectRestaurant(item.externalId)
								}
							>
								<p>{item.placeName}</p>
								<p>{item.addressName}</p>
								<p>{item.category}</p>
							</button>
						);
					})
				)}
			</div>

			<div className="admin-create-form-grid">
				<label className="admin-field">
					<span>카테고리</span>
					<select
						value={selectedCategoryId ?? ""}
						onChange={(event) =>
							onCategoryChange(
								event.target.value
									? Number(event.target.value)
									: undefined,
							)
						}
					>
						<option value="">카테고리 선택</option>
						{categories.map((category) => (
							<option key={category.id} value={category.id}>
								{category.name}
							</option>
						))}
					</select>
				</label>

				<label className="admin-field">
					<span>지역</span>
					<select
						value={selectedRegion}
						onChange={(event) =>
							onRegionChange(event.target.value)
						}
					>
						<option value="">{DEFAULT_REGION_TEXT}</option>
						{regions.map((region) => (
							<option key={region.name} value={region.name}>
								{region.displayName}
							</option>
						))}
					</select>
				</label>

				<label className="admin-field admin-create-description">
					<span>맛집 설명</span>
					<textarea
						rows={3}
						value={selectedDescription}
						required
						onChange={(event) =>
							onDescriptionChange(event.target.value)
						}
						placeholder="맛집 설명을 입력해 주세요."
						aria-label="맛집 설명"
					/>
				</label>
			</div>

			<div className="admin-panel__actions">
				<Button
					size="sm"
					loading={isCreating}
					disabled={!canCreate}
					onClick={onCreateSubmit}
				>
					맛집 생성
				</Button>
			</div>
		</section>
	);
}
