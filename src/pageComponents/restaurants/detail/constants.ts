import type { CategoryOption } from "#/apis/restaurants";
import {
	REGION_CODES,
	TIME_SLOT_CODES,
	toLargeCategoryLabel,
} from "#/shared/constants/DomainLabels";

export const REGION_OPTIONS = REGION_CODES;

export const PRICE_LEVEL_OPTIONS = ["₩", "₩₩", "₩₩₩", "₩₩₩₩", "₩₩₩₩₩"];

export const TIME_SLOT_OPTIONS = TIME_SLOT_CODES;

export const formatTimestamp = (value: string) =>
	new Intl.DateTimeFormat("ko-KR", {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
		hour12: false,
	}).format(new Date(value));

export const getCategoryLabel = (category: CategoryOption): string => {
	const large = category.largeCategory?.trim();
	const medium = category.mediumCategory?.trim() ?? category.name;

	if (large && medium) {
		return `${toLargeCategoryLabel(large)} · ${medium}`;
	}

	return medium;
};
