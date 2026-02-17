import type {
	CategoryOption,
	RestaurantDetail,
	RestaurantPatchRequest,
} from "#/apis/restaurants";

export type EditableRestaurant = {
	externalId: string;
	categoryId: string;
	name: string;
	address: string;
	rating: string;
	imageUrl: string;
	mapUrl: string;
	representativeReview: string;
	description: string;
	region: string;
	reviewCount: string;
	blogReviewCount: string;
	representMenu: string;
	representMenuPrice: string;
	priceLevel: string;
	aiMateSummaryTitle: string;
	aiMateSummaryContents: string;
	timeSlot: string;
	longitude: string;
	latitude: string;
};

export type CategoryGroup = {
	items: CategoryOption[];
	largeCategory: string;
};

export type DraftChangeHandler = (
	key: keyof EditableRestaurant,
	value: string,
) => void;

const toNullableNumber = (value: string) => {
	if (!value.trim()) {
		return null;
	}

	const parsed = Number(value);
	return Number.isFinite(parsed) ? parsed : null;
};

export const toEditableRestaurant = (
	restaurant: RestaurantDetail,
): EditableRestaurant => ({
	externalId: restaurant.externalId,
	categoryId:
		typeof restaurant.categoryId === "number"
			? String(restaurant.categoryId)
			: "",
	name: restaurant.name,
	address: restaurant.address,
	rating: restaurant.rating !== null ? String(restaurant.rating) : "",
	imageUrl: restaurant.imageUrl,
	mapUrl: restaurant.mapUrl,
	representativeReview: restaurant.representativeReview,
	description: restaurant.description,
	region: restaurant.region,
	reviewCount:
		restaurant.reviewCount !== null ? String(restaurant.reviewCount) : "",
	blogReviewCount:
		restaurant.blogReviewCount !== null
			? String(restaurant.blogReviewCount)
			: "",
	representMenu: restaurant.representMenu,
	representMenuPrice:
		restaurant.representMenuPrice !== null
			? String(restaurant.representMenuPrice)
			: "",
	priceLevel: restaurant.priceLevel,
	aiMateSummaryTitle: restaurant.aiMateSummaryTitle,
	aiMateSummaryContents: restaurant.aiMateSummaryContents.join("\n"),
	timeSlot: restaurant.timeSlot,
	longitude: String(restaurant.location?.coordinates[0] ?? ""),
	latitude: String(restaurant.location?.coordinates[1] ?? ""),
});

export const toRestaurantPatchRequest = (
	draft: EditableRestaurant,
): RestaurantPatchRequest => {
	const longitude = toNullableNumber(draft.longitude);
	const latitude = toNullableNumber(draft.latitude);

	return {
		externalId: draft.externalId.trim(),
		categoryId: toNullableNumber(draft.categoryId),
		name: draft.name.trim(),
		address: draft.address.trim(),
		rating: toNullableNumber(draft.rating),
		imageUrl: draft.imageUrl.trim(),
		mapUrl: draft.mapUrl.trim(),
		representativeReview: draft.representativeReview.trim(),
		description: draft.description.trim(),
		region: draft.region,
		reviewCount: toNullableNumber(draft.reviewCount),
		blogReviewCount: toNullableNumber(draft.blogReviewCount),
		representMenu: draft.representMenu.trim(),
		representMenuPrice: toNullableNumber(draft.representMenuPrice),
		priceLevel: draft.priceLevel,
		aiMateSummaryTitle: draft.aiMateSummaryTitle.trim(),
		aiMateSummaryContents: draft.aiMateSummaryContents
			.split("\n")
			.map((line) => line.trim())
			.filter(Boolean),
		timeSlot: draft.timeSlot as RestaurantDetail["timeSlot"],
		location:
			longitude !== null && latitude !== null
				? { coordinates: [longitude, latitude] }
				: null,
	};
};
