import type { DataIssue, GatheringItem } from "#/apis/gatherings";
import type { Chapter } from "#/pageComponents/gatherings/dashboard/types";

export const CHAPTERS: Chapter[] = [
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

export const formatDate = (value: string): string =>
	new Intl.DateTimeFormat("ko-KR", {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
	}).format(new Date(value));

export const formatDateTime = (value: string): string =>
	new Intl.DateTimeFormat("ko-KR", {
		month: "2-digit",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
		hour12: false,
	}).format(new Date(value));

export const toCountEntries = (values: string[]): Array<[string, number]> => {
	const counts = values.reduce<Record<string, number>>((acc, value) => {
		acc[value] = (acc[value] ?? 0) + 1;
		return acc;
	}, {});

	return Object.entries(counts).sort((a, b) => b[1] - a[1]);
};

export const toIssueClassName = (severity: DataIssue["severity"]): string => {
	if (severity === "ERROR") {
		return "admin-issue-tag admin-issue-tag--error";
	}
	if (severity === "WARN") {
		return "admin-issue-tag admin-issue-tag--warn";
	}
	return "admin-issue-tag admin-issue-tag--info";
};

export const resolveGatheringLabel = (gathering: GatheringItem): string => {
	if (gathering.title?.trim()) {
		return gathering.title;
	}

	return `모임 #${gathering.id}`;
};
