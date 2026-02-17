import React, {
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import { useNavigate } from "react-router-dom";
import {
	DataIssue,
	GatheringDashboardData,
	GatheringItem,
	adminService,
} from "../apis/admin";
import { useAuth } from "../providers";
import { Button, Toast } from "../shared/ui";

type ChapterId =
	| "overview"
	| "schedule"
	| "interests"
	| "participants"
	| "quality";

type Chapter = {
	id: ChapterId;
	label: string;
	description: string;
};

const CHAPTERS: Chapter[] = [
	{
		id: "overview",
		label: "개요",
		description: "모임/참여 현황의 핵심 지표를 확인합니다.",
	},
	{
		id: "schedule",
		label: "일정 트렌드",
		description: "지역/시간대 기준으로 모임 패턴을 봅니다.",
	},
	{
		id: "interests",
		label: "관심사",
		description: "선호/비선호 카테고리와 거리 범위를 파악합니다.",
	},
	{
		id: "participants",
		label: "참여자",
		description: "참여자 목록과 참여 모임 연결 상태를 봅니다.",
	},
	{
		id: "quality",
		label: "데이터 품질",
		description: "정합성 이슈를 빠르게 확인합니다.",
	},
];

const formatDate = (value: string): string =>
	new Intl.DateTimeFormat("ko-KR", {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
	}).format(new Date(value));

const formatDateTime = (value: string): string =>
	new Intl.DateTimeFormat("ko-KR", {
		month: "2-digit",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
		hour12: false,
	}).format(new Date(value));

const toCountEntries = (values: string[]): Array<[string, number]> => {
	const counts = values.reduce<Record<string, number>>((acc, value) => {
		acc[value] = (acc[value] ?? 0) + 1;
		return acc;
	}, {});

	return Object.entries(counts).sort((a, b) => b[1] - a[1]);
};

const toIssueClassName = (severity: DataIssue["severity"]): string => {
	if (severity === "ERROR") {
		return "admin-issue-tag admin-issue-tag--error";
	}
	if (severity === "WARN") {
		return "admin-issue-tag admin-issue-tag--warn";
	}
	return "admin-issue-tag admin-issue-tag--info";
};

const resolveGatheringLabel = (gathering: GatheringItem): string => {
	if (gathering.title?.trim()) {
		return gathering.title;
	}

	return `모임 #${gathering.id}`;
};

export function GatheringDashboardPage() {
	const navigate = useNavigate();
	const { logout, session } = useAuth();
	const [activeChapter, setActiveChapter] = useState<ChapterId>("overview");
	const [isLoading, setIsLoading] = useState(true);
	const [errorMessage, setErrorMessage] = useState("");
	const [toastMessage, setToastMessage] = useState("");
	const [dashboardData, setDashboardData] =
		useState<GatheringDashboardData | null>(null);
	const sectionRefs = useRef<Record<ChapterId, HTMLElement | null>>({
		overview: null,
		schedule: null,
		interests: null,
		participants: null,
		quality: null,
	});

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

	const fetchDashboard = useCallback(async (showToastOnSuccess = false) => {
		setIsLoading(true);
		setErrorMessage("");

		try {
			const response = await adminService.getGatheringDashboard();
			setDashboardData(response);
			if (showToastOnSuccess) {
				setToastMessage("모임 대시보드 데이터가 새로고침되었습니다.");
			}
		} catch (error) {
			if (error instanceof Error) {
				setErrorMessage(error.message);
			} else {
				setErrorMessage("모임 대시보드 데이터를 불러오지 못했습니다.");
			}
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchDashboard();
	}, [fetchDashboard]);

	const scrollToChapter = (chapterId: ChapterId) => {
		setActiveChapter(chapterId);
		sectionRefs.current[chapterId]?.scrollIntoView({
			behavior: "smooth",
			block: "start",
		});
	};

	const handleLogout = async () => {
		await logout();
		navigate("/login", { replace: true });
	};

	const metrics = useMemo(() => {
		if (!dashboardData) {
			return {
				activeGatherings: 0,
				participants: 0,
				upcomingWithin14Days: 0,
				averageParticipantFill: 0,
				averageTargetHeadcount: 0,
				participantCountByGathering: {} as Record<number, number>,
			};
		}

		const activeGatherings = dashboardData.gatherings.filter(
			(gathering) => !gathering.deletedAt,
		);
		const participantCountByGathering = dashboardData.participants.reduce(
			(acc, participant) => {
				if (typeof participant.gatheringId !== "number") {
					return acc;
				}
				acc[participant.gatheringId] =
					(acc[participant.gatheringId] ?? 0) + 1;
				return acc;
			},
			{} as Record<number, number>,
		);
		const totalGatheringCapacity = activeGatherings.reduce(
			(sum, gathering) => sum + gathering.peopleCount,
			0,
		);
		const linkedParticipants = dashboardData.participants.filter(
			(participant) => typeof participant.gatheringId === "number",
		).length;
		const fillRate =
			totalGatheringCapacity > 0
				? (linkedParticipants / totalGatheringCapacity) * 100
				: 0;

		const todayKey = new Date().toISOString().slice(0, 10);
		const limitDate = new Date();
		limitDate.setDate(limitDate.getDate() + 14);
		const limitKey = limitDate.toISOString().slice(0, 10);
		const upcomingWithin14Days = activeGatherings.filter(
			(gathering) =>
				gathering.scheduledDate >= todayKey &&
				gathering.scheduledDate <= limitKey,
		).length;

		const averageTargetHeadcount =
			activeGatherings.length > 0
				? totalGatheringCapacity / activeGatherings.length
				: 0;

		return {
			activeGatherings: activeGatherings.length,
			participants: dashboardData.participants.length,
			upcomingWithin14Days,
			averageParticipantFill: fillRate,
			averageTargetHeadcount,
			participantCountByGathering,
		};
	}, [dashboardData]);

	const chapterData = useMemo(() => {
		if (!dashboardData) {
			return {
				regionCounts: [] as Array<[string, number]>,
				timeSlotCounts: [] as Array<[string, number]>,
				distanceCounts: [] as Array<[string, number]>,
				preferenceCounts: [] as Array<[string, number]>,
				dislikeCounts: [] as Array<[string, number]>,
			};
		}

		const regionCounts = toCountEntries(
			dashboardData.gatherings.map((gathering) => gathering.region),
		);
		const timeSlotCounts = toCountEntries(
			dashboardData.gatherings.map((gathering) => gathering.timeSlot),
		);
		const distanceCounts = toCountEntries(
			dashboardData.participants.map(
				(participant) => participant.distanceRange,
			),
		);
		const preferenceCounts = toCountEntries(
			dashboardData.participants.flatMap(
				(participant) => participant.preferences,
			),
		);
		const dislikeCounts = toCountEntries(
			dashboardData.participants.map(
				(participant) => participant.dislikes,
			),
		);

		return {
			regionCounts,
			timeSlotCounts,
			distanceCounts,
			preferenceCounts,
			dislikeCounts,
		};
	}, [dashboardData]);

	const gatheringById = useMemo(() => {
		if (!dashboardData) {
			return {};
		}

		return dashboardData.gatherings.reduce<Record<number, GatheringItem>>(
			(acc, gathering) => {
				acc[gathering.id] = gathering;
				return acc;
			},
			{},
		);
	}, [dashboardData]);

	const renderCountBars = (rows: Array<[string, number]>) => {
		const maxCount = rows.reduce(
			(max, [, count]) => Math.max(max, count),
			0,
		);

		return (
			<div className="admin-insight-bars">
				{rows.length === 0 ? (
					<p className="admin-insight-empty">데이터가 없습니다.</p>
				) : null}
				{rows.map(([label, count]) => (
					<div className="admin-insight-bars__row" key={label}>
						<span>{label}</span>
						<div className="admin-insight-bars__track">
							<span
								style={{
									width: `${
										maxCount > 0
											? (count / maxCount) * 100
											: 0
									}%`,
								}}
							/>
						</div>
						<strong>{count}</strong>
					</div>
				))}
			</div>
		);
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
					<Button size="sm" onClick={() => fetchDashboard()}>
						다시 시도
					</Button>
				</section>
			</main>
		);
	}

	return (
		<main className="admin-shell admin-shell--insight">
			<header className="admin-topbar">
				<div className="admin-topbar__title-wrap">
					<p className="admin-topbar__eyebrow">
						Gathering Intelligence
					</p>
					<h1>모임/참여자 대시보드</h1>
					<p className="admin-topbar__mode">
						최종 갱신: {formatDateTime(dashboardData.generatedAt)}
					</p>
				</div>
				<div className="admin-topbar__actions admin-topbar__actions--insight">
					<span className="admin-profile">
						{session?.name ?? "관리자"}
					</span>
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
						onClick={() => fetchDashboard(true)}
					>
						새로고침
					</Button>
					<Button variant="inverse" size="sm" onClick={handleLogout}>
						로그아웃
					</Button>
				</div>
			</header>

			{errorMessage ? (
				<p className="admin-error" role="alert">
					{errorMessage}
				</p>
			) : null}

			<div className="admin-insight-layout">
				<aside className="admin-insight-sidebar">
					<p className="admin-insight-sidebar__title">챕터</p>
					<nav className="admin-insight-sidebar__nav">
						{CHAPTERS.map((chapter) => (
							<button
								key={chapter.id}
								type="button"
								className={`admin-insight-sidebar__item${
									activeChapter === chapter.id
										? " admin-insight-sidebar__item--active"
										: ""
								}`}
								onClick={() => scrollToChapter(chapter.id)}
							>
								<span>{chapter.label}</span>
								<small>{chapter.description}</small>
							</button>
						))}
					</nav>
				</aside>

				<div className="admin-insight-content">
					<section
						ref={(node) => {
							sectionRefs.current.overview = node;
						}}
						className="admin-panel admin-insight-section"
					>
						<h2>개요</h2>
						<div className="admin-insight-kpis">
							<article className="admin-insight-kpi">
								<span>활성 모임</span>
								<strong>{metrics.activeGatherings}</strong>
							</article>
							<article className="admin-insight-kpi">
								<span>참여자</span>
								<strong>{metrics.participants}</strong>
							</article>
							<article className="admin-insight-kpi">
								<span>14일 내 예정 모임</span>
								<strong>{metrics.upcomingWithin14Days}</strong>
							</article>
							<article className="admin-insight-kpi">
								<span>평균 목표 인원</span>
								<strong>
									{metrics.averageTargetHeadcount.toFixed(1)}
									명
								</strong>
							</article>
							<article className="admin-insight-kpi">
								<span>정원 대비 참여율</span>
								<strong>
									{metrics.averageParticipantFill.toFixed(1)}%
								</strong>
							</article>
						</div>
					</section>

					<section
						ref={(node) => {
							sectionRefs.current.schedule = node;
						}}
						className="admin-panel admin-insight-section"
					>
						<h2>일정 트렌드</h2>
						<div className="admin-insight-grid">
							<article className="admin-insight-card">
								<h3>지역 분포</h3>
								{renderCountBars(chapterData.regionCounts)}
							</article>
							<article className="admin-insight-card">
								<h3>시간대 분포</h3>
								{renderCountBars(chapterData.timeSlotCounts)}
							</article>
						</div>
						<div className="admin-insight-table-wrap">
							<table className="admin-insight-table">
								<thead>
									<tr>
										<th>모임</th>
										<th>예정일</th>
										<th>지역</th>
										<th>시간대</th>
										<th>정원</th>
										<th>참여자</th>
									</tr>
								</thead>
								<tbody>
									{dashboardData.gatherings.map(
										(gathering) => {
											const linkedParticipantCount =
												metrics
													.participantCountByGathering[
													gathering.id
												] ?? 0;
											return (
												<tr key={gathering.id}>
													<td>
														{resolveGatheringLabel(
															gathering,
														)}
													</td>
													<td>
														{formatDate(
															gathering.scheduledDate,
														)}
													</td>
													<td>{gathering.region}</td>
													<td>
														{gathering.timeSlot}
													</td>
													<td>
														{gathering.peopleCount}
													</td>
													<td>
														{linkedParticipantCount}
													</td>
												</tr>
											);
										},
									)}
								</tbody>
							</table>
						</div>
					</section>

					<section
						ref={(node) => {
							sectionRefs.current.interests = node;
						}}
						className="admin-panel admin-insight-section"
					>
						<h2>관심사</h2>
						<div className="admin-insight-grid">
							<article className="admin-insight-card">
								<h3>선호 카테고리</h3>
								{renderCountBars(chapterData.preferenceCounts)}
							</article>
							<article className="admin-insight-card">
								<h3>비선호 카테고리</h3>
								{renderCountBars(chapterData.dislikeCounts)}
							</article>
							<article className="admin-insight-card">
								<h3>거리 선호</h3>
								{renderCountBars(chapterData.distanceCounts)}
							</article>
						</div>
					</section>

					<section
						ref={(node) => {
							sectionRefs.current.participants = node;
						}}
						className="admin-panel admin-insight-section"
					>
						<h2>참여자</h2>
						<div className="admin-insight-table-wrap">
							<table className="admin-insight-table">
								<thead>
									<tr>
										<th>ID</th>
										<th>닉네임</th>
										<th>역할</th>
										<th>연결 모임</th>
										<th>거리 범위</th>
										<th>선호 카테고리</th>
										<th>비선호</th>
									</tr>
								</thead>
								<tbody>
									{dashboardData.participants.map(
										(participant) => {
											const linkedGathering =
												typeof participant.gatheringId ===
												"number"
													? gatheringById[
															participant
																.gatheringId
														]
													: undefined;

											return (
												<tr key={participant.id}>
													<td>{participant.id}</td>
													<td>
														{participant.nickname}
													</td>
													<td>{participant.role}</td>
													<td>
														{linkedGathering
															? resolveGatheringLabel(
																	linkedGathering,
																)
															: `연결 없음 (#${
																	participant.gatheringId ??
																	"-"
																})`}
													</td>
													<td>
														{
															participant.distanceRange
														}
													</td>
													<td>
														{participant.preferences.join(
															", ",
														)}
													</td>
													<td>
														{participant.dislikes}
													</td>
												</tr>
											);
										},
									)}
								</tbody>
							</table>
						</div>
					</section>

					<section
						ref={(node) => {
							sectionRefs.current.quality = node;
						}}
						className="admin-panel admin-insight-section"
					>
						<h2>데이터 품질</h2>
						<ul className="admin-issue-list">
							{dashboardData.issues.map((issue) => (
								<li key={issue.id} className="admin-issue-item">
									<div
										className={toIssueClassName(
											issue.severity,
										)}
									>
										{issue.severity}
									</div>
									<div className="admin-issue-item__content">
										<p>{issue.title}</p>
										<span>{issue.description}</span>
									</div>
								</li>
							))}
						</ul>
					</section>
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
