import type { GatheringItem } from "#/apis/gatherings";

export type ChapterId =
	| "overview"
	| "schedule"
	| "interests"
	| "participants"
	| "quality";

export type Chapter = {
	description: string;
	id: ChapterId;
	label: string;
};

export type DashboardMetrics = {
	activeGatherings: number;
	averageParticipantFill: number;
	averageTargetHeadcount: number;
	participantCountByGathering: Record<number, number>;
	participants: number;
	upcomingWithin14Days: number;
};

export type DashboardChapterData = {
	dislikeCounts: Array<[string, number]>;
	distanceCounts: Array<[string, number]>;
	preferenceCounts: Array<[string, number]>;
	regionCounts: Array<[string, number]>;
	timeSlotCounts: Array<[string, number]>;
};

export type GatheringById = Record<number, GatheringItem>;
