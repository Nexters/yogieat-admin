import React from "react";

import type { PageResponse, RestaurantListItem } from "#/apis/restaurants";
import { Button } from "#/shared/ui";

type RestaurantPaginationProps = {
	isLoading: boolean;
	onMovePage: (direction: "prev" | "next") => void;
	pageResponse: PageResponse<RestaurantListItem>;
	page: number;
};

export function RestaurantPagination({
	isLoading,
	onMovePage,
	page,
	pageResponse,
}: RestaurantPaginationProps) {
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
