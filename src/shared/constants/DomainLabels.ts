export const ALL_FILTER_VALUE = "ALL";

export const REGION_LABEL_BY_CODE = {
	HONGDAE: "홍대입구역",
	GANGNAM: "강남역",
	GONGDEOK: "공덕역",
	EULJIRO3GA: "을지로3가역",
	SADANG: "사당역",
	JONGNO3GA: "종로3가역",
	JAMSIL: "잠실역",
	SAMGAKJI: "삼각지역",
} as const;

export type RegionCode = keyof typeof REGION_LABEL_BY_CODE;

export const REGION_CODES = Object.keys(REGION_LABEL_BY_CODE) as RegionCode[];

export const LARGE_CATEGORY_LABEL_BY_CODE = {
	KOREAN: "한식",
	CHINESE: "중식",
	JAPANESE: "일식",
	WESTERN: "양식",
	ASIAN: "아시안",
	ANY: "상관없음",
} as const;

export const DISTANCE_RANGE_LABEL_BY_CODE = {
	RANGE_500M: "500m",
	RANGE_1KM: "1km",
	ANY: "상관없음",
} as const;

export const PARTICIPANT_ROLE_LABEL_BY_CODE = {
	HOST: "주최자",
	MEMBER: "참여자",
} as const;

export const DATA_ISSUE_SEVERITY_LABEL_BY_CODE = {
	INFO: "안내",
	WARN: "주의",
	ERROR: "오류",
} as const;

export type LargeCategoryCode = keyof typeof LARGE_CATEGORY_LABEL_BY_CODE;

export const LARGE_CATEGORY_CODES = Object.keys(
	LARGE_CATEGORY_LABEL_BY_CODE,
) as LargeCategoryCode[];

export const TIME_SLOT_LABEL_BY_CODE = {
	LUNCH: "점심",
	DINNER: "저녁",
	BOTH: "점심+저녁",
} as const;

export type TimeSlotCode = keyof typeof TIME_SLOT_LABEL_BY_CODE;

export const TIME_SLOT_CODES = Object.keys(
	TIME_SLOT_LABEL_BY_CODE,
) as TimeSlotCode[];

export const toRegionLabel = (value?: string | null): string => {
	if (!value) {
		return "-";
	}

	return REGION_LABEL_BY_CODE[value as RegionCode] ?? value;
};

export const toLargeCategoryLabel = (value?: string | null): string => {
	if (!value) {
		return "-";
	}

	return LARGE_CATEGORY_LABEL_BY_CODE[value as LargeCategoryCode] ?? value;
};

export const toTimeSlotLabel = (value?: string | null): string => {
	if (!value) {
		return "-";
	}

	return TIME_SLOT_LABEL_BY_CODE[value as TimeSlotCode] ?? value;
};

export const toDistanceRangeLabel = (value?: string | null): string => {
	if (!value) {
		return "-";
	}

	return DISTANCE_RANGE_LABEL_BY_CODE[value as keyof typeof DISTANCE_RANGE_LABEL_BY_CODE] ?? value;
};

export const toParticipantRoleLabel = (value?: string | null): string => {
	if (!value) {
		return "-";
	}

	return PARTICIPANT_ROLE_LABEL_BY_CODE[value as keyof typeof PARTICIPANT_ROLE_LABEL_BY_CODE] ?? value;
};

export const toIssueSeverityLabel = (value?: string | null): string => {
	if (!value) {
		return "-";
	}

	return DATA_ISSUE_SEVERITY_LABEL_BY_CODE[value as keyof typeof DATA_ISSUE_SEVERITY_LABEL_BY_CODE] ?? value;
};

export const toRegionFilterLabel = (value: string): string => {
	if (value === ALL_FILTER_VALUE) {
		return "전체";
	}

	return toRegionLabel(value);
};

export const toLargeCategoryFilterLabel = (value: string): string => {
	if (value === ALL_FILTER_VALUE) {
		return "전체";
	}

	return toLargeCategoryLabel(value);
};

export const toTimeSlotFilterLabel = (value: string): string => {
	if (value === ALL_FILTER_VALUE) {
		return "전체";
	}

	return toTimeSlotLabel(value);
};
