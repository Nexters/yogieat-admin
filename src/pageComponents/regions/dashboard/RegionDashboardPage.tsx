import React from "react";
import { useNavigate } from "react-router-dom";

import { getAdminServiceMode } from "#/apis/admin";
import type { RegionDetail } from "#/apis/regions";
import { useRegionDashboardPage } from "#/pageComponents/regions/dashboard/hooks";
import { useAuth } from "#/providers";
import { AdminTopbar, Button, Tag, Toast } from "#/shared/ui";

const REGION_STATUS_OPTIONS = [
	{ label: "전체", value: "ALL" },
	{ label: "운영중", value: "ACTIVE" },
	{ label: "비활성", value: "INACTIVE" },
] as const;

const REGION_PROVINCE_OPTIONS = [
	"서울",
	"경기",
	"인천",
	"부산",
	"대구",
	"광주",
	"대전",
	"울산",
	"세종",
	"강원",
	"충북",
	"충남",
	"전북",
	"전남",
	"경북",
	"경남",
	"제주",
] as const;

const formatCoordinate = (value: number) => value.toFixed(4);

const getRegionStatusLabel = (region: RegionDetail) =>
	region.active ? "운영중" : "비활성";

function OverviewCard({
	description,
	title,
	value,
}: {
	description: string;
	title: string;
	value: string;
}) {
	return (
		<article className="admin-region-overview-card">
			<p className="admin-region-overview-card__title">{title}</p>
			<strong className="admin-region-overview-card__value">
				{value}
			</strong>
			<p className="admin-region-overview-card__description">
				{description}
			</p>
		</article>
	);
}

function RegionListCard({
	isSelected,
	onSelect,
	region,
}: {
	isSelected: boolean;
	onSelect: () => void;
	region: RegionDetail;
}) {
	const coordinateSummary = [
		`경도 ${formatCoordinate(region.coordinatesStandard.coordinates[0])}`,
		`위도 ${formatCoordinate(region.coordinatesStandard.coordinates[1])}`,
	].join(" / ");

	return (
		<button
			type="button"
			className={[
				"admin-region-card",
				isSelected ? "admin-region-card--selected" : "",
			]
				.filter(Boolean)
				.join(" ")}
			onClick={onSelect}
		>
			<div className="admin-region-card__header">
				<div>
					<p className="admin-region-card__code">{region.code}</p>
					<h3>{region.displayName}</h3>
				</div>
				<span
					className={[
						"admin-region-status",
						region.active
							? "admin-region-status--active"
							: "admin-region-status--inactive",
					]
						.filter(Boolean)
						.join(" ")}
				>
					{getRegionStatusLabel(region)}
				</span>
			</div>
			<div className="admin-region-card__meta">
				<div>
					<span>정렬 순서</span>
					<strong>{region.sortOrder}</strong>
				</div>
				<div>
					<span>연결 맛집</span>
					<strong>{region.restaurantCount}개</strong>
				</div>
			</div>
			<div className="admin-region-card__footer">
				{region.province ? (
					<Tag size="small">{region.province}</Tag>
				) : null}
				<Tag size="small">{coordinateSummary}</Tag>
			</div>
		</button>
	);
}

function ReadonlyField({
	label,
	value,
}: {
	label: string;
	value: React.ReactNode;
}) {
	return (
		<div className="admin-region-field-card">
			<span>{label}</span>
			<strong>{value}</strong>
		</div>
	);
}

function EmptyInspector({ onCreate }: { onCreate: () => void }) {
	return (
		<div className="admin-region-empty-state">
			<div>
				<h3>지역을 선택해 주세요</h3>
				<p>
					목록에서 지역을 선택하면 연결 맛집 수, 좌표, 운영 상태를 한
					번에 확인하고 바로 수정할 수 있습니다.
				</p>
			</div>
			<Button size="sm" variant="primary" onClick={onCreate}>
				새 지역 등록
			</Button>
		</div>
	);
}

export function RegionDashboardPage() {
	const navigate = useNavigate();
	const { isAuthenticated, session, logout } = useAuth();
	const {
		activeRegionCount,
		applySearch,
		canDeleteSelected,
		canSubmit,
		closeDeleteDialog,
		deleteDisabledReason,
		deleteTargetRegion,
		detailErrorMessage,
		draft,
		draftErrors,
		filteredRegions,
		handleCancel,
		handleDeleteConfirm,
		handleDraftChange,
		handleEditStart,
		handleOpenCreate,
		handleProvinceChange,
		handleSearchInputChange,
		handleSelectRegion,
		handleStatusChange,
		handleSubmit,
		hasUnsavedChanges,
		inactiveRegionCount,
		isCreateMode,
		isDeleteDialogOpen,
		isDeleting,
		isEditing,
		isLoadingDetail,
		isLoadingList,
		isSaving,
		keywordInput,
		listErrorMessage,
		nextSortOrder,
		openDeleteDialog,
		panelErrorMessage,
		query,
		selectedRegion,
		toastMessage,
		totalRegionCount,
		totalRestaurantCount,
	} = useRegionDashboardPage();

	const accessToken = session?.tokenBundle?.accessToken?.trim();
	const isMockSession = Boolean(accessToken?.startsWith("mock-"));
	const showApiMode = isAuthenticated && getAdminServiceMode() === "mock";
	const shouldShowMockMode = showApiMode && isMockSession;

	const handleLogout = async () => {
		await logout();
		navigate("/login", { replace: true });
	};

	const inspectorTitle = isCreateMode
		? "새 지역 등록"
		: (selectedRegion?.displayName ?? "지역 상세");
	const inspectorDescription = isCreateMode
		? `정렬 순서는 기본값으로 ${nextSortOrder}가 제안됩니다.`
		: selectedRegion
			? "지역 코드와 좌표를 기준으로 운영 데이터의 기준점을 관리합니다."
			: "선택한 지역의 상세 정보가 이곳에 표시됩니다.";
	const draftLongitude = draft?.longitude.trim() || "-";
	const draftLatitude = draft?.latitude.trim() || "-";

	return (
		<main className="admin-shell admin-regions-page">
			<AdminTopbar
				eyebrow="관리자 페이지"
				title="지역 대시보드"
				subtitle={shouldShowMockMode ? "API Mode: MOCK" : undefined}
				actionsClassName="admin-topbar__actions--list"
				actions={
					<>
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
							onClick={() => navigate("/gatherings")}
						>
							모임 관리
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

			<section className="admin-region-overview">
				<OverviewCard
					title="전체 지역"
					value={`${totalRegionCount}개`}
					description="정렬 순서 기준으로 운영 중인 지역과 준비 중인 지역을 함께 확인합니다."
				/>
				<OverviewCard
					title="운영 상태 (활성 / 비활성)"
					value={`${activeRegionCount} / ${inactiveRegionCount}`}
					description="삭제 대신 비활성화가 필요한 지역을 빠르게 구분할 수 있습니다."
				/>
				<OverviewCard
					title="연결 맛집"
					value={`${totalRestaurantCount}개`}
					description="지역 삭제 가능 여부와 영향 범위를 맛집 연결 수 기준으로 바로 판단합니다."
				/>
			</section>

			<section className="admin-region-layout">
				<section className="admin-panel admin-region-list-panel">
					<div className="admin-panel__header">
						<div>
							<h2>지역 목록</h2>
							<p>
								코드, 운영용 이름, 연결 맛집 수를 기준으로
								지역을 빠르게 탐색합니다.
							</p>
						</div>
						<Button
							size="sm"
							variant="primary"
							onClick={handleOpenCreate}
						>
							지역 추가
						</Button>
					</div>

					<div className="admin-panel__controls admin-region-controls">
						<form
							className="admin-search-form"
							onSubmit={(event) => {
								event.preventDefault();
								applySearch();
							}}
						>
							<input
								value={keywordInput}
								onChange={(event) =>
									handleSearchInputChange(event.target.value)
								}
								placeholder="코드 또는 지역명으로 검색"
							/>
							<Button type="submit" size="sm" variant="secondary">
								검색
							</Button>
						</form>

						<div className="admin-filters admin-filters--inline">
							<label>
								<span>시/도</span>
								<select
									value={query.province ?? ""}
									onChange={(event) =>
										handleProvinceChange(event.target.value)
									}
								>
									<option value="">전체</option>
									{REGION_PROVINCE_OPTIONS.map((province) => (
										<option key={province} value={province}>
											{province}
										</option>
									))}
								</select>
							</label>
							<label>
								<span>상태</span>
								<select
									value={query.status}
									onChange={(event) =>
										handleStatusChange(
											event.target.value as
												| "ALL"
												| "ACTIVE"
												| "INACTIVE",
										)
									}
								>
									{REGION_STATUS_OPTIONS.map((option) => (
										<option
											key={option.value}
											value={option.value}
										>
											{option.label}
										</option>
									))}
								</select>
							</label>
						</div>
					</div>

					{listErrorMessage ? (
						<p className="admin-error" role="alert">
							{listErrorMessage}
						</p>
					) : null}

					<div className="admin-region-list">
						{isLoadingList ? (
							<div className="admin-region-empty-state admin-region-empty-state--compact">
								<p>지역 목록을 불러오는 중입니다.</p>
							</div>
						) : filteredRegions.length > 0 ? (
							filteredRegions.map((region) => (
								<RegionListCard
									key={region.id}
									region={region}
									isSelected={
										selectedRegion?.id === region.id &&
										!isCreateMode
									}
									onSelect={() =>
										handleSelectRegion(region.id)
									}
								/>
							))
						) : (
							<div className="admin-region-empty-state admin-region-empty-state--compact">
								<p>검색 조건에 맞는 지역이 없습니다.</p>
								<Button
									size="sm"
									variant="secondary"
									onClick={handleOpenCreate}
								>
									새 지역 등록
								</Button>
							</div>
						)}
					</div>
				</section>

				<section className="admin-panel admin-region-inspector">
					<div className="admin-panel__header">
						<div>
							<h2>{inspectorTitle}</h2>
							<p>{inspectorDescription}</p>
						</div>
						{selectedRegion || isCreateMode ? (
							<div className="admin-panel__actions">
								{isCreateMode || isEditing ? (
									<>
										<Button
											size="sm"
											variant="secondary"
											onClick={handleSubmit}
											loading={isSaving}
											disabled={!canSubmit}
										>
											{isCreateMode
												? "지역 등록"
												: "저장"}
										</Button>
										<Button
											size="sm"
											variant="tertiary"
											onClick={handleCancel}
											disabled={isSaving}
										>
											취소
										</Button>
									</>
								) : (
									<>
										<Button
											size="sm"
											variant="secondary"
											onClick={handleEditStart}
										>
											편집
										</Button>
										<Button
											size="sm"
											variant="tertiary"
											onClick={openDeleteDialog}
											disabled={!canDeleteSelected}
										>
											삭제
										</Button>
									</>
								)}
							</div>
						) : null}
					</div>

					{!selectedRegion && !isCreateMode ? (
						<EmptyInspector onCreate={handleOpenCreate} />
					) : isLoadingDetail && !isCreateMode ? (
						<div className="admin-region-empty-state admin-region-empty-state--compact">
							<p>지역 상세 정보를 불러오는 중입니다.</p>
						</div>
					) : (
						<>
							{detailErrorMessage ? (
								<p className="admin-error" role="alert">
									{detailErrorMessage}
								</p>
							) : null}
							{panelErrorMessage ? (
								<p className="admin-error" role="alert">
									{panelErrorMessage}
								</p>
							) : null}
							{hasUnsavedChanges ? (
								<p className="admin-region-unsaved">
									저장되지 않은 변경 사항이 있습니다.
								</p>
							) : null}

							{draft && (isCreateMode || isEditing) ? (
								<form
									className="admin-region-form"
									onSubmit={(event) => {
										event.preventDefault();
										void handleSubmit();
									}}
								>
									<div className="admin-region-form-grid">
										<label className="admin-field">
											<span>지역 코드</span>
											<input
												value={draft.code}
												onChange={(event) =>
													handleDraftChange(
														"code",
														event.target.value,
													)
												}
												placeholder="예: SEONGSU"
											/>
											<small>
												{draftErrors.code ??
													"영문 대문자, 숫자, 언더스코어만 허용됩니다."}
											</small>
										</label>

										<label className="admin-field">
											<span>표시 이름</span>
											<input
												value={draft.displayName}
												onChange={(event) =>
													handleDraftChange(
														"displayName",
														event.target.value,
													)
												}
												placeholder="예: 성수역"
											/>
											<small>
												{draftErrors.displayName ??
													"운영자와 맛집 동기화 작업자가 함께 보는 이름입니다."}
											</small>
										</label>

										<label className="admin-field">
											<span>시/도</span>
											<select
												value={draft.province}
												onChange={(event) =>
													handleDraftChange(
														"province",
														event.target.value,
													)
												}
											>
												<option value="">선택</option>
												{REGION_PROVINCE_OPTIONS.map(
													(province) => (
														<option
															key={province}
															value={province}
														>
															{province}
														</option>
													),
												)}
											</select>
											<small>
												{draftErrors.province ??
													"목록 조회에서 시/도 필터 기준으로 사용됩니다."}
											</small>
										</label>

										<label className="admin-field">
											<span>경도</span>
											<input
												value={draft.longitude}
												onChange={(event) =>
													handleDraftChange(
														"longitude",
														event.target.value,
													)
												}
												placeholder="126.9236"
											/>
											<small>
												{draftErrors.longitude ??
													"지도 중심점 계산 기준이 되는 값입니다."}
											</small>
										</label>

										<label className="admin-field">
											<span>위도</span>
											<input
												value={draft.latitude}
												onChange={(event) =>
													handleDraftChange(
														"latitude",
														event.target.value,
													)
												}
												placeholder="37.5572"
											/>
											<small>
												{draftErrors.latitude ??
													"지도 중심점 계산 기준이 되는 값입니다."}
											</small>
										</label>

										<label className="admin-field">
											<span>정렬 순서</span>
											<input
												value={draft.sortOrder}
												onChange={(event) =>
													handleDraftChange(
														"sortOrder",
														event.target.value,
													)
												}
												placeholder={String(
													nextSortOrder,
												)}
											/>
											<small>
												{draftErrors.sortOrder ??
													"값이 작을수록 목록 상단에 노출됩니다."}
											</small>
										</label>

										<label className="admin-region-toggle">
											<input
												type="checkbox"
												checked={draft.active}
												onChange={(event) =>
													handleDraftChange(
														"active",
														event.target.checked,
													)
												}
											/>
											<div>
												<span>운영 상태</span>
												<p>
													비활성화하면 지역은 유지하되
													운영 노출만 조정할 수
													있습니다.
												</p>
											</div>
										</label>
									</div>

									<div className="admin-region-preview">
										<div className="admin-region-preview__header">
											<div>
												<p>미리보기</p>
												<h3>
													{draft.displayName.trim() ||
														"새 지역"}
												</h3>
											</div>
											<span
												className={[
													"admin-region-status",
													draft.active
														? "admin-region-status--active"
														: "admin-region-status--inactive",
												]
													.filter(Boolean)
													.join(" ")}
											>
												{draft.active
													? "운영중"
													: "비활성"}
											</span>
										</div>
										<dl className="admin-region-preview__meta">
											<div>
												<dt>코드</dt>
												<dd>{draft.code || "-"}</dd>
											</div>
											<div>
												<dt>정렬 순서</dt>
												<dd>
													{draft.sortOrder || "-"}
												</dd>
											</div>
											<div>
												<dt>시/도</dt>
												<dd>{draft.province || "-"}</dd>
											</div>
											<div>
												<dt>기준 좌표</dt>
												<dd>
													{draftLongitude} /{" "}
													{draftLatitude}
												</dd>
											</div>
										</dl>
									</div>
								</form>
							) : selectedRegion ? (
								<div className="admin-region-detail">
									<div className="admin-region-detail__stats">
										<ReadonlyField
											label="지역 코드"
											value={selectedRegion.code}
										/>
										<ReadonlyField
											label="운영 상태"
											value={getRegionStatusLabel(
												selectedRegion,
											)}
										/>
										<ReadonlyField
											label="시/도"
											value={
												selectedRegion.province || "-"
											}
										/>
										<ReadonlyField
											label="정렬 순서"
											value={selectedRegion.sortOrder}
										/>
										<ReadonlyField
											label="연결 맛집 수"
											value={`${selectedRegion.restaurantCount}개`}
										/>
									</div>

									<div className="admin-region-detail__stats">
										<ReadonlyField
											label="경도"
											value={formatCoordinate(
												selectedRegion
													.coordinatesStandard
													.coordinates[0],
											)}
										/>
										<ReadonlyField
											label="위도"
											value={formatCoordinate(
												selectedRegion
													.coordinatesStandard
													.coordinates[1],
											)}
										/>
									</div>

									<div className="admin-region-guidance">
										<h3>운용 가이드</h3>
										<p>
											지역 코드는 맛집 데이터와 직접
											연결되므로, 코드 수정 시 연결된 맛집
											화면 반영 여부를 함께 확인하는 것이
											안전합니다.
										</p>
										<p>
											{selectedRegion.restaurantCount > 0
												? `${selectedRegion.restaurantCount}개 맛집이 연결되어 있어 삭제 대신 비활성화를 우선 검토하는 편이 안전합니다.`
												: "연결된 맛집이 없어 필요 시 바로 삭제할 수 있습니다."}
										</p>
										{deleteDisabledReason ? (
											<p className="admin-region-guidance__warning">
												{deleteDisabledReason}
											</p>
										) : null}
									</div>
								</div>
							) : null}
						</>
					)}
				</section>
			</section>

			{isDeleteDialogOpen && deleteTargetRegion ? (
				<div
					className="admin-confirm-modal__overlay"
					onClick={(event) => {
						if (event.target === event.currentTarget) {
							closeDeleteDialog();
						}
					}}
					role="presentation"
				>
					<div className="admin-confirm-modal__content">
						<h3>지역 삭제</h3>
						<p className="admin-confirm-modal__description">
							<strong>{`"${deleteTargetRegion.displayName}"`}</strong>
							{` 지역을 삭제하시겠습니까?`}
							<span className="admin-confirm-modal__warning">
								삭제하면 복구할 수 없습니다.
							</span>
						</p>
						<div className="admin-confirm-modal__buttons">
							<Button
								size="sm"
								variant="secondary"
								type="button"
								onClick={closeDeleteDialog}
								disabled={isDeleting}
							>
								취소
							</Button>
							<Button
								size="sm"
								variant="tertiary"
								loading={isDeleting}
								onClick={() => void handleDeleteConfirm()}
								disabled={isDeleting}
							>
								삭제
							</Button>
						</div>
					</div>
				</div>
			) : null}

			{toastMessage ? (
				<div className="admin-toast">
					<Toast message={toastMessage} />
				</div>
			) : null}
		</main>
	);
}
