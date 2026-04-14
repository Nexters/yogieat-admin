import React from "react";
import { useNavigate } from "react-router-dom";

import { ChapterSidebar } from "#/pageComponents/gatherings/dashboard/components";
import {
	CHAPTERS,
	formatDateTime,
} from "#/pageComponents/gatherings/dashboard/constants";
import { useGatheringDashboardPage } from "#/pageComponents/gatherings/dashboard/hooks/useGatheringDashboardPage";
import {
	InterestsSection,
	OverviewSection,
	ParticipantsSection,
	QualitySection,
	ScheduleSection,
} from "#/pageComponents/gatherings/dashboard/sections";
import { useAuth } from "#/providers";
import { AdminTopbar, Button, Toast } from "#/shared/ui";

export function GatheringDashboardPage() {
	const navigate = useNavigate();
	const { logout } = useAuth();
	const {
		activeChapter,
		chapterData,
		dashboardData,
		errorMessage,
		gatheringById,
		getSectionRef,
		handleRefresh,
		isLoading,
		metrics,
		recentGatherings,
		scrollToChapter,
		toastMessage,
	} = useGatheringDashboardPage();

	const handleLogout = async () => {
		await logout();
		navigate("/login", { replace: true });
	};

	if (isLoading) {
		return (
			<main className="admin-shell">
				<section className="admin-panel admin-panel--status">
					<p>모임 대시보드 데이터를 불러오는 중입니다.</p>
				</section>
			</main>
		);
	}

	if (!dashboardData) {
		return (
			<main className="admin-shell">
				<section className="admin-panel admin-panel--status">
					<h1>모임 대시보드를 불러오지 못했습니다.</h1>
					<p>{errorMessage || "잠시 후 다시 시도해 주세요."}</p>
					<Button size="sm" onClick={() => handleRefresh(false)}>
						다시 시도
					</Button>
				</section>
			</main>
		);
	}

	return (
		<main className="admin-shell admin-shell--insight">
			<AdminTopbar
				eyebrow="Gathering Intelligence"
				title="모임/참여자 대시보드"
				subtitle={`최종 갱신: ${formatDateTime(dashboardData.generatedAt)}`}
				actionsClassName="admin-topbar__actions--insight"
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
							onClick={() => navigate("/restaurants")}
						>
							맛집 관리
						</Button>
						<Button
							variant="secondary"
							size="sm"
							onClick={() => handleRefresh(true)}
						>
							새로고침
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

			{errorMessage ? (
				<p className="admin-error" role="alert">
					{errorMessage}
				</p>
			) : null}

			<div className="admin-insight-layout">
				<ChapterSidebar
					activeChapter={activeChapter}
					chapters={CHAPTERS}
					onSelectChapter={scrollToChapter}
				/>

				<div className="admin-insight-content">
					<OverviewSection
						metrics={metrics}
						sectionRef={getSectionRef("overview")}
					/>
					<ScheduleSection
						gatherings={recentGatherings}
						participantCountByGathering={
							metrics.participantCountByGathering
						}
						regionCounts={chapterData.regionCounts}
						sectionRef={getSectionRef("schedule")}
						timeSlotCounts={chapterData.timeSlotCounts}
					/>
					<InterestsSection
						dislikeCounts={chapterData.dislikeCounts}
						distanceCounts={chapterData.distanceCounts}
						preferenceCounts={chapterData.preferenceCounts}
						sectionRef={getSectionRef("interests")}
					/>
					<ParticipantsSection
						gatheringById={gatheringById}
						participants={dashboardData.participants}
						sectionRef={getSectionRef("participants")}
					/>
					<QualitySection
						issues={dashboardData.issues}
						sectionRef={getSectionRef("quality")}
					/>
				</div>
			</div>

			{toastMessage ? (
				<div className="admin-toast">
					<Toast message={toastMessage} />
				</div>
			) : null}
		</main>
	);
}
