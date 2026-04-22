import React, { FormEvent, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
	type GatheringListItem,
	type GatheringListQuery,
	type PageResponse,
} from "#/apis/gatherings";
import { useGetGatherings } from "#/hooks";
import { useAuth } from "#/providers";
import {
	ALL_FILTER_VALUE,
	REGION_CODES,
	TIME_SLOT_CODES,
	toRegionFilterLabel,
	toRegionLabel,
	toTimeSlotFilterLabel,
	toTimeSlotLabel,
} from "#/shared/constants/DomainLabels";
import { AdminTopbar, Button } from "#/shared/ui";
import { getErrorMessage } from "#/shared/utils";

const PAGE_SIZE = 8;
const DEFAULT_REGION_OPTIONS = [ALL_FILTER_VALUE, ...REGION_CODES];
const DEFAULT_TIME_SLOT_OPTIONS = [ALL_FILTER_VALUE, ...TIME_SLOT_CODES];

const DEFAULT_PAGE: PageResponse<GatheringListItem> = {
	content: [],
	page: 0,
	size: PAGE_SIZE,
	totalElements: 0,
	totalPages: 1,
	hasNext: false,
};

const formatDate = (value: string): string =>
	new Intl.DateTimeFormat("ko-KR", {
		month: "2-digit",
		day: "2-digit",
		weekday: "short",
	}).format(new Date(value));

const formatDateTime = (value: string): string =>
	new Intl.DateTimeFormat("ko-KR", {
		month: "2-digit",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
		hour12: false,
	}).format(new Date(value));

const toFillRatePercent = (fillRate: number): string => {
	const normalized = fillRate <= 1 ? fillRate * 100 : fillRate;
	return `${normalized.toFixed(1)}%`;
};

const resolveGatheringTitle = (gathering: GatheringListItem): string => {
	if (gathering.title?.trim()) {
		return gathering.title;
	}
	return `모임 #${gathering.id}`;
};

export function GatheringListPage() {
	const navigate = useNavigate();
	const { logout } = useAuth();
	const [keywordInput, setKeywordInput] = useState("");
	const [query, setQuery] = useState<GatheringListQuery>({
		page: 0,
		size: PAGE_SIZE,
		includeDeleted: false,
	});
	const [pageInputText, setPageInputText] = useState("1");
	const {
		data: pageResponse = DEFAULT_PAGE,
		error: gatheringListError,
		isLoading,
	} = useGetGatherings(query);
	const errorMessage = gatheringListError
		? getErrorMessage(
				gatheringListError,
				"모임 목록을 불러오지 못했습니다.",
			)
		: "";

	const regionOptions = useMemo(() => {
		const options = new Set<string>(DEFAULT_REGION_OPTIONS);
		if (query.region) {
			options.add(query.region);
		}
		pageResponse.content.forEach((gathering) => {
			if (gathering.region) {
				options.add(gathering.region);
			}
		});
		return Array.from(options);
	}, [pageResponse.content, query.region]);

	const timeSlotOptions = useMemo(() => {
		const options = new Set<string>(DEFAULT_TIME_SLOT_OPTIONS);
		if (query.timeSlot) {
			options.add(query.timeSlot);
		}
		pageResponse.content.forEach((gathering) => {
			if (gathering.timeSlot) {
				options.add(gathering.timeSlot);
			}
		});
		return Array.from(options);
	}, [pageResponse.content, query.timeSlot]);

	const handleLogout = async () => {
		await logout();
		navigate("/login", { replace: true });
	};

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
			region: region === ALL_FILTER_VALUE ? undefined : region,
		}));
	};

	const handleTimeSlotChange = (timeSlot: string) => {
		setQuery((current) => ({
			...current,
			page: 0,
			timeSlot:
				timeSlot === ALL_FILTER_VALUE
					? undefined
					: (timeSlot as GatheringListQuery["timeSlot"]),
		}));
	};

	const handleIncludeDeletedChange = (checked: boolean) => {
		setQuery((current) => ({
			...current,
			page: 0,
			includeDeleted: checked,
		}));
	};

	const handlePageMove = (direction: "prev" | "next") => {
		setQuery((current) => {
			const totalPages = Math.max(pageResponse.totalPages, 1);
			const maxPage = Math.max(totalPages - 1, 0);
			if (direction === "prev") {
				return {
					...current,
					page: Math.max(current.page - 1, 0),
				};
			}

			return {
				...current,
				page: Math.min(current.page + 1, maxPage),
			};
		});
	};

	const handlePageSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const parsed = Number.parseInt(pageInputText, 10);
		if (!Number.isFinite(parsed)) {
			setPageInputText(String(Math.min(pageResponse.page + 1, pageResponse.totalPages)));
			return;
		}

		const totalPages = Math.max(pageResponse.totalPages, 1);
		const maxPage = Math.max(totalPages - 1, 0);
		const requestedPage = parsed - 1;
		const safePage = Math.max(0, Math.min(requestedPage, maxPage));
		setQuery((current) => ({
			...current,
			page: safePage,
		}));
	};

	const handlePageInputChange = (value: string) => {
		setPageInputText(value);
	};

	useEffect(() => {
		setPageInputText(
			String(Math.min(pageResponse.page + 1, pageResponse.totalPages)),
		);
	}, [pageResponse.page, pageResponse.totalPages]);

	return (
		<main className="admin-shell">
			<AdminTopbar
				eyebrow="Gathering Operations"
				title="모임 리스트"
				subtitle="생성된 모임과 참여 인원 현황을 확인합니다."
				actionsClassName="admin-topbar__actions--gathering"
				actions={
					<>
						<Button
							variant="inverse"
							size="sm"
							onClick={() => navigate("/gatherings/dashboard")}
						>
							모임 대시보드
						</Button>
						<Button
							variant="inverse"
							size="sm"
							onClick={() => navigate("/restaurants")}
						>
							맛집 관리
						</Button>
						<Button
							variant="inverse"
							size="sm"
							onClick={() => navigate("/regions")}
						>
							지역 관리
						</Button>
						<Button
							variant="inverse"
							size="sm"
							onClick={handleLogout}
						>
							로그아웃
						</Button>
					</>
				}
			/>

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
							placeholder="모임명, Access Key, ID 검색"
							aria-label="모임 검색어"
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
							<span>시간대</span>
							<select
								value={query.timeSlot ?? ALL_FILTER_VALUE}
								onChange={(event) =>
									handleTimeSlotChange(event.target.value)
								}
							>
								{timeSlotOptions.map((timeSlot) => (
									<option key={timeSlot} value={timeSlot}>
										{toTimeSlotFilterLabel(timeSlot)}
									</option>
								))}
							</select>
						</label>
						<label className="admin-checkbox-filter">
							<input
								type="checkbox"
								checked={Boolean(query.includeDeleted)}
								onChange={(event) =>
									handleIncludeDeletedChange(
										event.target.checked,
									)
								}
							/>
							<span>삭제된 모임 포함</span>
						</label>
					</div>
					<div className="admin-gathering-summary">
						<span>총 {pageResponse.totalElements}건</span>
					</div>
				</div>

				<div className="admin-table-wrap">
					<table className="admin-table">
						<thead>
							<tr>
								<th>ID</th>
								<th>모임명</th>
								<th>예정일</th>
								<th>지역</th>
								<th>시간대</th>
								<th>정원</th>
								<th>참여자</th>
								<th>충족률</th>
								<th>수정일</th>
								<th>상세</th>
							</tr>
						</thead>
						<tbody>
							{isLoading ? (
								<tr>
									<td
										colSpan={10}
										className="admin-table__status"
									>
										모임 목록을 불러오는 중입니다.
									</td>
								</tr>
							) : null}
							{!isLoading && errorMessage ? (
								<tr>
									<td
										colSpan={10}
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
										colSpan={10}
										className="admin-table__status"
									>
										조건에 맞는 모임이 없습니다.
									</td>
								</tr>
							) : null}
							{!isLoading &&
								!errorMessage &&
								pageResponse.content.map((gathering) => (
									<tr
										key={gathering.id}
										onClick={() =>
											navigate(
												`/gatherings/${gathering.id}`,
											)
										}
									>
										<td>{gathering.id}</td>
										<td>
											{resolveGatheringTitle(gathering)}
										</td>
										<td>
											{formatDate(
												gathering.scheduledDate,
											)}
										</td>
										<td>
											{toRegionLabel(gathering.region)}
										</td>
										<td>
											{toTimeSlotLabel(
												gathering.timeSlot,
											)}
										</td>
										<td>{gathering.peopleCount}</td>
										<td>{gathering.participantCount}</td>
										<td>{toFillRatePercent(gathering.fillRate)}</td>
										<td>
											{formatDateTime(
												gathering.updatedAt,
											)}
										</td>
										<td>
											<Button
												size="sm"
												variant="tertiary"
												onClick={(event) => {
													event.stopPropagation();
													navigate(
														`/gatherings/${gathering.id}`,
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
							모임 목록을 불러오는 중입니다.
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
							조건에 맞는 모임이 없습니다.
						</p>
					) : null}
					{!isLoading &&
						!errorMessage &&
						pageResponse.content.map((gathering) => (
							<article
								key={`gathering-card-${gathering.id}`}
								className="admin-gathering-card"
							>
								<div className="admin-gathering-card__header">
									<div>
										<h2>
											{resolveGatheringTitle(gathering)}
										</h2>
										<p>ID: {gathering.id}</p>
									</div>
									<Button
										size="sm"
										variant="secondary"
										onClick={() =>
											navigate(
												`/gatherings/${gathering.id}`,
											)
										}
									>
										상세 보기
									</Button>
								</div>
								<div className="admin-gathering-card__meta">
									<span>
										예정일:{" "}
										{formatDate(gathering.scheduledDate)}
									</span>
									<span>
										지역: {toRegionLabel(gathering.region)}
									</span>
									<span>
										시간대:{" "}
										{toTimeSlotLabel(gathering.timeSlot)}
									</span>
									<span>정원: {gathering.peopleCount}</span>
									<span>
										참여자: {gathering.participantCount}
									</span>
									<span>
										충족률: {toFillRatePercent(gathering.fillRate)}
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
					<form
						className="admin-pagination__jump"
						onSubmit={handlePageSubmit}
					>
						<label className="admin-pagination__jump-label">
							<input
								value={pageInputText}
								type="text"
								inputMode="numeric"
								pattern="[0-9]*"
								aria-label="이동할 페이지(1부터 시작)"
								onChange={(event) =>
									handlePageInputChange(event.target.value)
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
						onClick={() => handlePageMove("next")}
					>
						다음
					</Button>
				</footer>
			</section>
		</main>
	);
}
