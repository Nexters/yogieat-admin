import React, { FormEvent } from "react";

import type { PageResponse, RestaurantListItem } from "#/apis/restaurants";
import { Button } from "#/shared/ui";

type RestaurantPaginationProps = {
	isLoading: boolean;
	onMovePage: (direction: "prev" | "next") => void;
	onMoveToPage: () => void;
	onPageInputChange: (value: string) => void;
	page: number;
	pageInputText: string;
	pageResponse: PageResponse<RestaurantListItem>;
};

export function RestaurantPagination({
	isLoading,
	onMovePage,
	onMoveToPage,
	onPageInputChange,
	page,
	pageInputText,
	pageResponse,
}: RestaurantPaginationProps) {
	const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		onMoveToPage();
	};

	return (
		<footer className="admin-pagination">
			<Button
				size="sm"
				variant="inverse"
				disabled={page === 0 || isLoading}
				onClick={() => onMovePage("prev")}
			>
				이전
			</Button>
			<span>
				{pageResponse.page + 1} / {pageResponse.totalPages}&nbsp;(
				{pageResponse.totalElements}건)
			</span>
			<form className="admin-pagination__jump" onSubmit={handleSubmit}>
				<label className="admin-pagination__jump-label">
					<input
						value={pageInputText}
						type="text"
						inputMode="numeric"
						pattern="[0-9]*"
						aria-label="이동할 페이지(1부터 시작)"
						onChange={(event) =>
							onPageInputChange(event.target.value)
						}
					/>
					<Button size="sm" variant="inverse" type="submit">
						이동
					</Button>
				</label>
			</form>
			<Button
				size="sm"
				variant="inverse"
				disabled={!pageResponse.hasNext || isLoading}
				onClick={() => onMovePage("next")}
			>
				다음
			</Button>
		</footer>
	);
}
