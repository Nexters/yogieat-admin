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
			dashboardData.gatherings.map((gathering) =>
				toRegionLabel(gathering.region),
			),
		);
		const timeSlotCounts = toCountEntries(
			dashboardData.gatherings.map((gathering) =>
				toTimeSlotLabel(gathering.timeSlot),
			),
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

	const gatheringById = useMemo<GatheringById>(() => {
		if (!dashboardData) {
			return {};
		}

		return dashboardData.gatherings.reduce<GatheringById>(
			(acc, gathering) => {
				acc[gathering.id] = gathering;
				return acc;
			},
			{},
		);
	}, [dashboardData]);

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
		scrollToChapter,
		toastMessage,
	};
}
