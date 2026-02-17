export type ParticipantRole = "HOST" | "MEMBER" | string;
export type ParticipantDistanceRange =
	| "RANGE_500M"
	| "RANGE_1KM"
	| "ANY"
	| string;

export type DataIssueSeverity = "INFO" | "WARN" | "ERROR";
export type TimeSlot = "LUNCH" | "DINNER" | "BOTH";

export type GatheringItem = {
	id: number;
	accessKey: string;
	title: string | null;
	scheduledDate: string;
	timeSlot: TimeSlot;
	region: string;
	peopleCount: number;
	deletedAt: string | null;
	createdAt: string;
	updatedAt: string;
};

export type GatheringListItem = {
	id: number;
	title: string | null;
	accessKey: string;
	scheduledDate: string;
	timeSlot: TimeSlot;
	region: string;
	peopleCount: number;
	participantCount: number;
	fillRate: number;
	deletedAt: string | null;
	updatedAt: string;
};

export type GatheringListQuery = {
	page: number;
	size: number;
	keyword?: string;
	region?: string;
	timeSlot?: TimeSlot;
	includeDeleted?: boolean;
};

export type ParticipantItem = {
	id: number;
	gatheringId: number | null;
	nickname: string;
	role: ParticipantRole;
	distanceRange: ParticipantDistanceRange;
	preferences: string[];
	dislikes: string;
	createdAt: string;
	updatedAt: string;
};

export type DataIssue = {
	id: string;
	severity: DataIssueSeverity;
	title: string;
	description: string;
	relatedId?: number;
};

export type GatheringDashboardData = {
	generatedAt: string;
	gatherings: GatheringItem[];
	participants: ParticipantItem[];
	issues: DataIssue[];
};

export type GatheringDetail = {
	gathering: GatheringItem;
	participants: ParticipantItem[];
	participantCount: number;
	fillRate: number;
};

export type PageResponse<T> = {
	content: T[];
	page: number;
	size: number;
	totalElements: number;
	totalPages: number;
	hasNext: boolean;
};
