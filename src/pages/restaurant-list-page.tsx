import React, {
	FormEvent,
	useCallback,
	useEffect,
	useMemo,
	useState,
} from "react";
import { useNavigate } from "react-router-dom";
import {
	ADMIN_API_MODE,
	CategoryOption,
	PageResponse,
	RestaurantListItem,
	RestaurantListQuery,
	adminService,
} from "../apis/admin";
import { useAuth } from "../providers";
import { Button, Toast } from "../shared/ui";

const PAGE_SIZE = 6;
const DEFAULT_REGION_OPTIONS = [
	"ALL",
	"EULJIRO3GA",
	"GANGNAM",
	"JONGNO3GA",
	"SEOUL",
	"BUSAN",
	"DAEGU",
	"JEJU",
];
const DEFAULT_LARGE_CATEGORY_OPTIONS = [
	"ALL",
	"KOREAN",
	"CHINESE",
	"JAPANESE",
	"WESTERN",
	"ASIAN",
	"ANY",
];

const DEFAULT_PAGE: PageResponse<RestaurantListItem> = {
	content: [],
	page: 0,
	size: PAGE_SIZE,
	totalElements: 0,
	totalPages: 1,
	hasNext: false,
};

const getCategoryLabel = (category: CategoryOption): string => {
	const large = category.largeCategory?.trim();
	const medium = category.mediumCategory?.trim() ?? category.name;

	if (large && medium) {
		return `${large} · ${medium}`;
	}

	return medium;
};

const formatDateTime = (value: string) =>
	new Intl.DateTimeFormat("ko-KR", {
		month: "2-digit",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
		hour12: false,
	}).format(new Date(value));

const toImageSrc = (value: string | null | undefined): string => {
	if (!value) {
		return "";
	}
	return value.trim();
};

export function RestaurantListPage() {
	const navigate = useNavigate();
	const { logout, session } = useAuth();
	const [categories, setCategories] = useState<CategoryOption[]>([]);
	const [keywordInput, setKeywordInput] = useState("");
	const [isLoading, setIsLoading] = useState(true);
	const [isSyncingAll, setIsSyncingAll] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");
	const [toastMessage, setToastMessage] = useState("");
	const [imageErrorById, setImageErrorById] = useState<Record<number, true>>(
		{},
	);
	const [query, setQuery] = useState<RestaurantListQuery>({
		page: 0,
		size: PAGE_SIZE,
	});
	const [pageResponse, setPageResponse] =
		useState<PageResponse<RestaurantListItem>>(DEFAULT_PAGE);

	const categoryNameById = useMemo(() => {
		return categories.reduce<Record<number, string>>((acc, category) => {
			acc[category.id] = getCategoryLabel(category);
			return acc;
		}, {});
	}, [categories]);

	const regionOptions = useMemo(() => {
		const optionSet = new Set<string>(DEFAULT_REGION_OPTIONS);
		if (query.region) {
			optionSet.add(query.region);
		}
		pageResponse.content.forEach((restaurant) => {
			if (restaurant.region) {
				optionSet.add(restaurant.region);
			}
		});

		return Array.from(optionSet);
	}, [pageResponse.content, query.region]);

	const largeCategoryOptions = useMemo(() => {
		const optionSet = new Set<string>(DEFAULT_LARGE_CATEGORY_OPTIONS);
		if (query.largeCategory) {
			optionSet.add(query.largeCategory);
		}
		categories.forEach((category) => {
			if (category.largeCategory) {
				optionSet.add(category.largeCategory);
			}
		});

		return Array.from(optionSet);
	}, [categories, query.largeCategory]);

	const fetchRestaurants = useCallback(
		async (nextQuery: RestaurantListQuery) => {
			setIsLoading(true);
			setErrorMessage("");

			try {
				const response = await adminService.getRestaurants(nextQuery);
				setPageResponse(response);
			} catch (error) {
				if (error instanceof Error) {
					setErrorMessage(error.message);
				} else {
					setErrorMessage("맛집 목록을 불러오지 못했습니다.");
				}
			} finally {
				setIsLoading(false);
			}
		},
		[],
	);

	useEffect(() => {
		let mounted = true;
		adminService
			.getCategories()
			.then((response) => {
				if (!mounted) {
					return;
				}
				setCategories(response);
			})
			.catch(() => {
				if (!mounted) {
					return;
				}
				setCategories([]);
			});

		return () => {
			mounted = false;
		};
	}, []);

	useEffect(() => {
		fetchRestaurants(query);
	}, [fetchRestaurants, query]);

	useEffect(() => {
		setImageErrorById({});
	}, [pageResponse.content]);

	useEffect(() => {
		if (!toastMessage) {
			return;
		}

		const timer = window.setTimeout(() => {
			setToastMessage("");
		}, 2200);

		return () => {
			window.clearTimeout(timer);
		};
	}, [toastMessage]);

	const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setQuery((current) => ({
			...current,
			page: 0,
			keyword: keywordInput.trim() || undefined,
		}));
	};

	const handleRegionChange = (region: string) => {
		setQuery((current) => ({
			...current,
			page: 0,
			region: region === "ALL" ? undefined : region,
		}));
	};

	const handleLargeCategoryChange = (rawLargeCategory: string) => {
		setQuery((current) => ({
			...current,
			page: 0,
			largeCategory:
				rawLargeCategory === "ALL" ? undefined : rawLargeCategory,
			categoryId: undefined,
		}));
	};

	const handlePageMove = (direction: "prev" | "next") => {
		setQuery((current) => {
			if (direction === "prev") {
				return {
					...current,
					page: Math.max(current.page - 1, 0),
				};
			}

			return {
				...current,
				page: current.page + 1,
			};
		});
	};

	const handleLogout = async () => {
		await logout();
		navigate("/login", { replace: true });
	};

	const handleSyncAll = async () => {
		setIsSyncingAll(true);
		try {
			const result = await adminService.syncAllRestaurants();
			await fetchRestaurants(query);
			setToastMessage(result.message ?? "전체 동기화가 완료되었습니다.");
		} catch (error) {
			if (error instanceof Error) {
				setToastMessage(error.message);
			} else {
				setToastMessage("전체 동기화 중 오류가 발생했습니다.");
			}
		} finally {
			setIsSyncingAll(false);
		}
	};

	const handleImageError = (restaurantId: number) => {
		setImageErrorById((current) => {
			if (current[restaurantId]) {
				return current;
			}
			return {
				...current,
				[restaurantId]: true,
			};
		});
	};

	const renderRestaurantThumbnail = (
		restaurant: RestaurantListItem,
		sizeClassName: string,
	) => {
		const imageSrc = toImageSrc(restaurant.imageUrl);
		const hasImage = Boolean(imageSrc) && !imageErrorById[restaurant.id];

		return (
			<div className={`admin-restaurant-thumb ${sizeClassName}`}>
				{hasImage ? (
					<img
						src={imageSrc}
						alt={`${restaurant.name} 대표 이미지`}
						loading="lazy"
						onError={() => handleImageError(restaurant.id)}
					/>
				) : (
					<span>NO IMAGE</span>
				)}
			</div>
		);
	};

	return (
		<main className="admin-shell">
			<header className="admin-topbar">
				<div className="admin-topbar__title-wrap">
					<p className="admin-topbar__eyebrow">Yogieat Admin</p>
					<h1>맛집 관리</h1>
					<p className="admin-topbar__mode">
						API Mode: {ADMIN_API_MODE.toUpperCase()}
					</p>
				</div>
				<div className="admin-topbar__actions admin-topbar__actions--list">
					<span className="admin-profile">
						{session?.name ?? "관리자"}
					</span>
					<Button
						variant="inverse"
						size="sm"
						onClick={() => navigate("/gatherings")}
					>
						모임 관리
					</Button>
					<Button variant="inverse" size="sm" onClick={handleLogout}>
						로그아웃
					</Button>
				</div>
			</header>

			<section className="admin-panel">
				<div className="admin-panel__controls">
					<form
						className="admin-search-form"
						onSubmit={handleSearchSubmit}
					>
						<input
							value={keywordInput}
							onChange={(event) =>
								setKeywordInput(event.target.value)
							}
							placeholder="맛집명, 주소, 설명으로 검색"
							aria-label="검색어"
						/>
						<Button size="sm" type="submit">
							검색
						</Button>
					</form>
					<div className="admin-filters">
						<label>
							<span>지역</span>
							<select
								value={query.region ?? "ALL"}
								onChange={(event) =>
									handleRegionChange(event.target.value)
								}
							>
								{regionOptions.map((region) => (
									<option key={region} value={region}>
										{region}
									</option>
								))}
							</select>
						</label>
						<label>
							<span>카테고리</span>
							<select
								value={query.largeCategory ?? "ALL"}
								onChange={(event) =>
									handleLargeCategoryChange(
										event.target.value,
									)
								}
							>
								<option value="ALL">ALL</option>
								{largeCategoryOptions
									.filter((category) => category !== "ALL")
									.map((largeCategory) => (
										<option
											key={largeCategory}
											value={largeCategory}
										>
											{largeCategory}
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
									<td
										colSpan={8}
										className="admin-table__status"
									>
										목록을 불러오는 중입니다.
									</td>
								</tr>
							) : null}
							{!isLoading && errorMessage ? (
								<tr>
									<td
										colSpan={8}
										className="admin-table__status"
									>
										{errorMessage}
									</td>
								</tr>
							) : null}
							{!isLoading &&
							!errorMessage &&
							pageResponse.content.length === 0 ? (
								<tr>
									<td
										colSpan={8}
										className="admin-table__status"
									>
										조건에 맞는 맛집이 없습니다.
									</td>
								</tr>
							) : null}
							{!isLoading &&
								!errorMessage &&
								pageResponse.content.map((restaurant) => (
									<tr
										key={restaurant.id}
										onClick={() =>
											navigate(
												`/restaurants/${restaurant.id}`,
											)
										}
									>
										<td>{restaurant.id}</td>
										<td>
											{renderRestaurantThumbnail(
												restaurant,
												"admin-restaurant-thumb--table",
											)}
										</td>
										<td>{restaurant.name}</td>
										<td>
											{restaurant.categoryId
												? (categoryNameById[
														restaurant.categoryId
													] ?? restaurant.categoryId)
												: "-"}
										</td>
										<td>
											{restaurant.rating
												? restaurant.rating.toFixed(1)
												: "-"}
										</td>
										<td>{restaurant.region}</td>
										<td>
											{formatDateTime(
												restaurant.updatedAt,
											)}
										</td>
										<td>
											<Button
												size="sm"
												variant="tertiary"
												onClick={(event) => {
													event.stopPropagation();
													navigate(
														`/restaurants/${restaurant.id}`,
													);
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
						<p className="admin-list-cards__status">
							{errorMessage}
						</p>
					) : null}
					{!isLoading &&
					!errorMessage &&
					pageResponse.content.length === 0 ? (
						<p className="admin-list-cards__status">
							조건에 맞는 맛집이 없습니다.
						</p>
					) : null}
					{!isLoading &&
						!errorMessage &&
						pageResponse.content.map((restaurant) => (
							<article
								key={`card-${restaurant.id}`}
								className="admin-restaurant-card"
							>
								{renderRestaurantThumbnail(
									restaurant,
									"admin-restaurant-thumb--card",
								)}
								<div className="admin-restaurant-card__header">
									<div>
										<h2>{restaurant.name}</h2>
										<p>ID: {restaurant.id}</p>
									</div>
									<Button
										size="sm"
										variant="secondary"
										onClick={() =>
											navigate(
												`/restaurants/${restaurant.id}`,
											)
										}
									>
										상세 보기
									</Button>
								</div>
								<div className="admin-restaurant-card__meta">
									<span>
										카테고리:{" "}
										{restaurant.categoryId
											? (categoryNameById[
													restaurant.categoryId
												] ?? restaurant.categoryId)
											: "-"}
									</span>
									<span>
										평점:{" "}
										{restaurant.rating
											? restaurant.rating.toFixed(1)
											: "-"}
									</span>
									<span>지역: {restaurant.region}</span>
									<span>
										수정일:{" "}
										{formatDateTime(restaurant.updatedAt)}
									</span>
								</div>
							</article>
						))}
				</div>

				<footer className="admin-pagination">
					<Button
						size="sm"
						variant="inverse"
						disabled={query.page === 0 || isLoading}
						onClick={() => handlePageMove("prev")}
					>
						이전
					</Button>
					<span>
						{pageResponse.page + 1} / {pageResponse.totalPages}
						&nbsp;({pageResponse.totalElements}건)
					</span>
					<Button
						size="sm"
						variant="inverse"
						disabled={!pageResponse.hasNext || isLoading}
						onClick={() => handlePageMove("next")}
					>
						다음
					</Button>
				</footer>
			</section>

			{toastMessage ? (
				<div className="admin-toast">
					<Toast message={toastMessage} />
				</div>
			) : null}
		</main>
	);
}
