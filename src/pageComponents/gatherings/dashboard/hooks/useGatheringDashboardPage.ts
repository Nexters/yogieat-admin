import { useCallback, useMemo, useRef, useState } from "react";

import { useGetGatheringDashboard } from "#/hooks";
import { toCountEntries } from "#/pageComponents/gatherings/dashboard/constants";
import type {
	ChapterId,
	DashboardChapterData,
	DashboardMetrics,
	GatheringById,
} from "#/pageComponents/gatherings/dashboard/types";
import {
	toRegionLabel,
	toTimeSlotLabel,
	toDistanceRangeLabel,
	toLargeCategoryLabel,
} from "#/shared/constants/DomainLabels";
import { useAutoDismissToast } from "#/shared/hooks";
import { getErrorMessage } from "#/shared/utils";

export function useGatheringDashboardPage() {
	const [activeChapter, setActiveChapter] = useState<ChapterId>("overview");
	const [toastMessage, setToastMessage] = useState("");
	const {
		data: dashboardData,
		error: dashboardError,
		isLoading,
		refetch: refetchDashboard,
	} = useGetGatheringDashboard();
	const errorMessage = dashboardError
		? getErrorMessage(
				dashboardError,
				"모임 대시보드 데이터를 불러오지 못했습니다.",
			)
		: "";
	const clearToastMessage = useCallback(() => {
		setToastMessage("");
	}, []);
	const sectionRefs = useRef<Record<ChapterId, HTMLElement | null>>({
		overview: null,
		schedule: null,
		interests: null,
		participants: null,
		quality: null,
	});

	useAutoDismissToast(toastMessage, clearToastMessage);

	const scrollToChapter = useCallback((chapterId: ChapterId) => {
		setActiveChapter(chapterId);
		sectionRefs.current[chapterId]?.scrollIntoView({
			behavior: "smooth",
			block: "start",
		});
	}, []);

	const getSectionRef = useCallback(
		(chapterId: ChapterId) => (node: HTMLElement | null) => {
			sectionRefs.current[chapterId] = node;
		},
		[],
	);

	const handleRefresh = useCallback(
		async (showToastOnSuccess: boolean) => {
			const response = await refetchDashboard();
			if (response.error) {
				const message = getErrorMessage(
					response.error,
					"모임 대시보드 데이터를 불러오지 못했습니다.",
				);
				setToastMessage(message);
				return;
			}

			if (showToastOnSuccess) {
				setToastMessage("모임 대시보드 데이터가 새로고침되었습니다.");
			}
		},
		[refetchDashboard],
	);

	const recentGatherings = useMemo(() => {
		if (!dashboardData) return [];
		const twoWeeksAgo = new Date();
		twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 13);
		twoWeeksAgo.setHours(0, 0, 0, 0);
		return dashboardData.gatherings.filter(
			(g) => new Date(g.createdAt) >= twoWeeksAgo,
		);
	}, [dashboardData]);

	const recentParticipants = useMemo(() => {
		if (!dashboardData) return [];
		const recentGatheringIds = new Set(recentGatherings.map((g) => g.id));
		return dashboardData.participants.filter(
			(p) =>
				typeof p.gatheringId === "number" &&
				recentGatheringIds.has(p.gatheringId),
		);
	}, [dashboardData, recentGatherings]);

	const metrics = useMemo<DashboardMetrics>(() => {
		if (!dashboardData) {
			return {
				activeGatherings: 0,
				participants: 0,
				upcomingWithin14Days: 0,
				averageParticipantFill: 0,
				averageTargetHeadcount: 0,
				participantCountByGathering: {},
			};
		}

		const activeGatherings = recentGatherings.filter(
			(gathering) => !gathering.deletedAt,
		);
		const participantCountByGathering = recentParticipants.reduce(
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
		const linkedParticipants = recentParticipants.filter(
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
			participants: recentParticipants.length,
			upcomingWithin14Days,
			averageParticipantFill: fillRate,
			averageTargetHeadcount,
			participantCountByGathering,
		};
	}, [dashboardData, recentGatherings, recentParticipants]);

	const chapterData = useMemo<DashboardChapterData>(() => {
		if (!dashboardData) {
			return {
				regionCounts: [],
				timeSlotCounts: [],
				distanceCounts: [],
				preferenceCounts: [],
				dislikeCounts: [],
			};
		}

		const regionCounts = toCountEntries(
			recentGatherings.map((gathering) =>
				toRegionLabel(gathering.region),
			),
		);
		const timeSlotCounts = toCountEntries(
			recentGatherings.map((gathering) =>
				toTimeSlotLabel(gathering.timeSlot),
			),
		);
		const distanceCounts = toCountEntries(
			recentParticipants.map(
				(participant) => toDistanceRangeLabel(participant.distanceRange),
			),
		);
		const preferenceCounts = toCountEntries(
			recentParticipants.flatMap(
				(participant) =>
					(participant.preferences ?? []).map((preference) =>
						toLargeCategoryLabel(preference),
					),
			),
		);
		const dislikeCounts = toCountEntries(
			recentParticipants.flatMap((participant) =>
				(participant.dislikes ?? "")
					.split(",")
					.map((dislike) => dislike.trim())
					.filter(Boolean)
					.map((dislike) => toLargeCategoryLabel(dislike)),
			),
		);

		return {
			regionCounts,
			timeSlotCounts,
			distanceCounts,
			preferenceCounts,
			dislikeCounts,
		};
	}, [dashboardData, recentGatherings, recentParticipants]);

	const gatheringById = useMemo<GatheringById>(() => {
		if (!dashboardData) {
			return {};
		}

		return recentGatherings.reduce<GatheringById>(
			(acc, gathering) => {
				acc[gathering.id] = gathering;
				return acc;
			},
			{},
		);
	}, [recentGatherings]);

	return {
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
	};
}
