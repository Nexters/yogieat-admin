import React, { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";

import type { GatheringDetail } from "#/apis/gatherings";
import { useGetGatheringById } from "#/hooks";
import { NotFoundPage } from "#/pageComponents/common";
import { useAuth } from "#/providers";
import {
	toRegionLabel,
	toTimeSlotLabel,
} from "#/shared/constants/domain-labels";
import { AdminTopbar, Button } from "#/shared/ui";
import { getErrorMessage } from "#/shared/utils";

const formatDate = (value: string): string =>
	new Intl.DateTimeFormat("ko-KR", {
		year: "numeric",
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

const resolveGatheringTitle = (
	detail: GatheringDetail | null,
	fallbackId: number,
): string => {
	const title = detail?.gathering.title?.trim();
	if (title) {
		return title;
	}
	return `모임 #${fallbackId}`;
};

export function GatheringDetailPage() {
	const navigate = useNavigate();
	const { logout } = useAuth();
	const { gatheringId: gatheringIdParam } = useParams();
	const gatheringId = Number(gatheringIdParam);
	const hasValidId = Number.isFinite(gatheringId) && gatheringId > 0;
	const {
		data: detail,
		error: detailError,
		isLoading,
	} = useGetGatheringById(gatheringId, hasValidId);
	const errorMessage = detailError
		? getErrorMessage(detailError, "모임 상세 정보를 불러오지 못했습니다.")
		: "";

	const handleLogout = async () => {
		await logout();
		navigate("/login", { replace: true });
	};

	const participantPreferencesById = useMemo(() => {
		if (!detail) {
			return {};
		}
		return detail.participants.reduce<Record<number, string>>(
			(acc, participant) => {
				acc[participant.id] = participant.preferences.join(", ");
				return acc;
			},
			{},
		);
	}, [detail]);

	if (!hasValidId) {
		return (
			<NotFoundPage
				title="유효하지 않은 모임 ID입니다."
				description="모임 목록에서 다시 선택해 주세요."
				actionTo="/gatherings"
				actionLabel="모임 목록으로 이동"
			/>
		);
	}

	if (isLoading) {
		return (
			<main className="admin-shell">
				<section className="admin-panel admin-panel--status">
					<p>모임 정보를 불러오는 중입니다.</p>
				</section>
			</main>
		);
	}

	if (!detail) {
		return (
			<NotFoundPage
				title="요청한 모임을 찾을 수 없습니다."
				description={
					errorMessage || "존재하지 않는 모임일 수 있습니다."
				}
				actionTo="/gatherings"
				actionLabel="모임 목록으로 이동"
			/>
		);
	}

	return (
		<main className="admin-shell">
			<AdminTopbar
				eyebrow="Gathering Detail"
				title={resolveGatheringTitle(detail, gatheringId)}
				subtitle={`참여자 ${detail.participantCount}명 / 정원 ${detail.gathering.peopleCount}명`}
				actionsClassName="admin-topbar__actions--detail"
				actions={
					<>
						<Button
							variant="inverse"
							size="sm"
							onClick={() => navigate("/gatherings")}
						>
							모임 목록
						</Button>
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
							onClick={handleLogout}
						>
							로그아웃
						</Button>
					</>
				}
			/>

			<section className="admin-panel admin-panel--detail">
				{errorMessage ? (
					<p className="admin-error" role="alert">
						{errorMessage}
					</p>
				) : null}

				<div className="admin-detail-meta">
					<span>
						생성일: {formatDateTime(detail.gathering.createdAt)}
					</span>
					<span>
						수정일: {formatDateTime(detail.gathering.updatedAt)}
					</span>
				</div>

				<div className="admin-detail-grid">
					<label className="admin-field">
						<span>모임 ID</span>
						<div className="admin-readonly">
							{detail.gathering.id}
						</div>
					</label>
					<label className="admin-field">
						<span>Access Key</span>
						<div className="admin-readonly">
							{detail.gathering.accessKey}
						</div>
					</label>
					<label className="admin-field">
						<span>예정일</span>
						<div className="admin-readonly">
							{formatDate(detail.gathering.scheduledDate)}
						</div>
					</label>
					<label className="admin-field">
						<span>지역</span>
						<div className="admin-readonly">
							{toRegionLabel(detail.gathering.region)}
						</div>
					</label>
					<label className="admin-field">
						<span>시간대</span>
						<div className="admin-readonly">
							{toTimeSlotLabel(detail.gathering.timeSlot)}
						</div>
					</label>
					<label className="admin-field">
						<span>정원</span>
						<div className="admin-readonly">
							{detail.gathering.peopleCount}
						</div>
					</label>
					<label className="admin-field">
						<span>참여자</span>
						<div className="admin-readonly">
							{detail.participantCount}
						</div>
					</label>
					<label className="admin-field">
						<span>충족률</span>
						<div className="admin-readonly">{detail.fillRate}%</div>
					</label>
					<label className="admin-field">
						<span>삭제 상태</span>
						<div className="admin-readonly">
							{detail.gathering.deletedAt ? "삭제됨" : "활성"}
						</div>
					</label>
				</div>
			</section>

			<section className="admin-panel">
				<header className="admin-panel__header">
					<h2>참여자 목록</h2>
					<p>
						현재 모임에 연결된 참여자 {detail.participantCount}명을
						보여줍니다.
					</p>
				</header>

				<div className="admin-table-wrap">
					<table className="admin-table">
						<thead>
							<tr>
								<th>ID</th>
								<th>닉네임</th>
								<th>역할</th>
								<th>거리 범위</th>
								<th>선호 카테고리</th>
								<th>비선호</th>
								<th>수정일</th>
							</tr>
						</thead>
						<tbody>
							{detail.participants.length === 0 ? (
								<tr>
									<td
										colSpan={7}
										className="admin-table__status"
									>
										연결된 참여자가 없습니다.
									</td>
								</tr>
							) : null}
							{detail.participants.map((participant) => (
								<tr key={participant.id}>
									<td>{participant.id}</td>
									<td>{participant.nickname}</td>
									<td>{participant.role}</td>
									<td>{participant.distanceRange}</td>
									<td>
										{participantPreferencesById[
											participant.id
										] || "-"}
									</td>
									<td>{participant.dislikes}</td>
									<td>
										{formatDateTime(participant.updatedAt)}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>

				<div className="admin-list-cards">
					{detail.participants.length === 0 ? (
						<p className="admin-list-cards__status">
							연결된 참여자가 없습니다.
						</p>
					) : null}
					{detail.participants.map((participant) => (
						<article
							key={`participant-card-${participant.id}`}
							className="admin-participant-card"
						>
							<div className="admin-participant-card__header">
								<h3>{participant.nickname}</h3>
								<span>{participant.role}</span>
							</div>
							<div className="admin-participant-card__meta">
								<span>ID: {participant.id}</span>
								<span>거리: {participant.distanceRange}</span>
								<span>
									선호:{" "}
									{participantPreferencesById[
										participant.id
									] || "-"}
								</span>
								<span>비선호: {participant.dislikes}</span>
								<span>
									수정일:{" "}
									{formatDateTime(participant.updatedAt)}
								</span>
							</div>
						</article>
					))}
				</div>
			</section>
		</main>
	);
}
