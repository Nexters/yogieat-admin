import {
	AdminSession,
	CategoryOption,
	DataIssue,
	GatheringDetail,
	GatheringDashboardData,
	GatheringItem,
	GatheringListItem,
	GatheringListQuery,
	LoginRequest,
	PageResponse,
	ParticipantItem,
	RestaurantDetail,
	RestaurantListItem,
	RestaurantListQuery,
	RestaurantPatchRequest,
	SyncResult,
} from "#/apis/admin/types";

type InternalCategory = CategoryOption & {
	largeCategory: string;
	mediumCategory: string;
};

const LOGIN_CREDENTIALS = {
	loginId: "admin",
	password: "admin1234",
};

export const CATEGORY_SEED: InternalCategory[] = [
	{
		id: 10,
		name: "중화요리",
		largeCategory: "CHINESE",
		mediumCategory: "중화요리",
		depth: 1,
	},
	{
		id: 11,
		name: "황제짬뽕",
		largeCategory: "KOREAN",
		mediumCategory: "황제짬뽕",
		depth: 1,
	},
	{
		id: 12,
		name: "골뱅이무침",
		largeCategory: "KOREAN",
		mediumCategory: "골뱅이무침",
		depth: 1,
	},
	{
		id: 13,
		name: "중식파인다이닝",
		largeCategory: "CHINESE",
		mediumCategory: "중식파인다이닝",
		depth: 1,
	},
	{
		id: 14,
		name: "일본가정식",
		largeCategory: "JAPANESE",
		mediumCategory: "일본가정식",
		depth: 1,
	},
	{
		id: 15,
		name: "막걸리/한식안주",
		largeCategory: "KOREAN",
		mediumCategory: "막걸리/한식안주",
		depth: 1,
	},
	{
		id: 16,
		name: "태국음식, 팟타이, 뿌팟퐁커리",
		largeCategory: "ASIAN",
		mediumCategory: "태국음식, 팟타이, 뿌팟퐁커리",
		depth: 1,
	},
	{
		id: 17,
		name: "인도커리, 탄두리치킨",
		largeCategory: "ASIAN",
		mediumCategory: "인도커리, 탄두리치킨",
		depth: 1,
	},
];

export const RESTAURANT_SEED: RestaurantDetail[] = [
	{
		id: 1,
		externalId: "8264592",
		categoryId: 12,
		name: "동경우동",
		address: "서울 중구 수표로 48",
		rating: 4.1,
		imageUrl:
			"http://t1.daumcdn.net/local/kakaomapPhoto/review/7adb70048cc6e54f7e292317f37c507e0426a3ac?original",
		mapUrl: "https://place.map.kakao.com/8264592",
		representativeReview:
			"대단한 맛집은 아니지만 우동맛 깔끔하고 면 쫄깃합니다. 가성비도 좋았어요.",
		description:
			"수제 면으로 만든 쫄깃한 우동과 바삭한 튀김을 맛볼 수 있는 우동 전문점입니다. 따뜻한 국물이 속을 편안하게 해줍니다.",
		region: "EULJIRO3GA",
		location: {
			coordinates: [126.99295969662815, 37.56523025885532],
		},
		reviewCount: 210,
		blogReviewCount: 254,
		representMenu: "튀김우동",
		representMenuPrice: 6500,
		priceLevel: "₩",
		aiMateSummaryTitle: "오래된 노포의 깊고 따뜻한 우동 한 그릇",
		aiMateSummaryContents: [
			"튀김우동 추천",
			"생활의 달인 언급",
			"바테이블",
		],
		timeSlot: "BOTH",
		createdAt: "2026-02-17T09:05:49.557Z",
		updatedAt: "2026-02-17T09:05:49.557Z",
	},
	{
		id: 2,
		externalId: "12083255",
		categoryId: 12,
		name: "명인돈까스 본점",
		address: "서울 중구 을지로20길 24",
		rating: 4.2,
		imageUrl:
			"http://t1.daumcdn.net/local/kakaomapPhoto/review/cfc5063e85baaaf27bb2289a4fa2c6f9e10b6512?original",
		mapUrl: "https://place.map.kakao.com/12083255",
		representativeReview:
			"혼자 와도 둘이 와도 셋이 와도 코돈부르는 하나는 해라 알겠니?\n새우도 존맛이더라 여유되면 새우도해라 알겠니?\n\n튀김이 마지막까지 무르지 않고 사장님도 친절하시고 최곱니다~",
		description:
			"부드러운 안심으로 만든 히레카츠 전문점입니다. 겉은 바삭하고 속은 촉촉한 돈카츠는 육즙이 풍부하여 깊은 맛을 선사합니다.",
		region: "EULJIRO3GA",
		location: {
			coordinates: [126.990899659805, 37.5653319306017],
		},
		reviewCount: 75,
		blogReviewCount: 63,
		representMenu: "생선가스",
		representMenuPrice: 11000,
		priceLevel: "₩₩₩",
		aiMateSummaryTitle: "담백한 생선까스와 정갈한 일식 돈까스",
		aiMateSummaryContents: ["생선가스 추천"],
		timeSlot: "LUNCH",
		createdAt: "2026-02-17T09:05:54.899Z",
		updatedAt: "2026-02-17T09:05:54.899Z",
	},
	{
		id: 3,
		externalId: "10252806",
		categoryId: 10,
		name: "대려도",
		address: "서울 강남구 테헤란로 124",
		rating: 3.8,
		imageUrl:
			"http://t1.daumcdn.net/localfiy/5F4013DAF0084563AC42A2C66BD022F4",
		mapUrl: "https://place.map.kakao.com/10252806",
		representativeReview:
			"예전에는 대려도만 있었는데 이제는 2층에 대려도가 있고 1층은 카페가 있다. 테이블간 간격이 좁다!\n최애는 빠스찹쌀떡! 엄청 달다...",
		description:
			"호텔 출신 셰프의 정통 중식 요리를 맛볼 수 있는 고급 레스토랑입니다. 특히 바삭한 북경오리 요리가 시그니처 메뉴로 손꼽힙니다.",
		region: "GANGNAM",
		location: {
			coordinates: [127.032268469419, 37.4935288570166],
		},
		reviewCount: 66,
		blogReviewCount: 108,
		representMenu: "삼선짬뽕",
		representMenuPrice: 14000,
		priceLevel: "₩₩₩₩₩",
		aiMateSummaryTitle: "전통 북경요리의 깊은 맛과 고요한 공간",
		aiMateSummaryContents: ["프라이빗룸", "콜키지 부과"],
		timeSlot: "BOTH",
		createdAt: "2026-02-17T09:06:16.758Z",
		updatedAt: "2026-02-17T09:06:16.758Z",
	},
	{
		id: 4,
		externalId: "9780807",
		categoryId: 10,
		name: "동순원 성환본점",
		address: "서울 종로구 돈화문로 100",
		rating: 3.6,
		imageUrl:
			"http://t1.daumcdn.net/local/kakaomapPhoto/review/94b308577eea5d72b6a2852521b041590dccf415?original",
		mapUrl: "https://place.map.kakao.com/9780807",
		representativeReview:
			"근처 베이비페어 갔다가 짜장면 땡겨 들린 집. 짬뽕이 맛있다는 소문에 짬뽕도 주문 함...",
		description:
			"정통 중식 요리를 깔끔하게 즐길 수 있는 곳입니다. 바삭한 탕수육과 고슬고슬한 볶음밥이 인기가 많습니다.",
		region: "JONGNO3GA",
		location: {
			coordinates: [127.12980936605447, 36.91698966919916],
		},
		reviewCount: 74,
		blogReviewCount: 253,
		representMenu: "짜장면",
		representMenuPrice: 7000,
		priceLevel: "₩₩",
		aiMateSummaryTitle: "전통의 깊이 담은 깔끔한 중식 한상",
		aiMateSummaryContents: ["짜장면 추천", "프라이빗룸"],
		timeSlot: "LUNCH",
		createdAt: "2026-02-17T09:09:40.316Z",
		updatedAt: "2026-02-17T09:09:40.316Z",
	},
];

const GATHERING_ALLOWED_REGIONS = new Set(["HONGDAE", "GANGNAM"]);
const GATHERING_ALLOWED_TIME_SLOTS = new Set(["LUNCH", "DINNER", "BOTH"]);

const normalizePreferenceToken = (value: string): string => {
	const normalized = value.trim();
	if (!normalized) {
		return "";
	}

	const mapping: Record<string, string> = {
		한식: "KOREAN",
		일식: "JAPANESE",
		중식: "CHINESE",
		양식: "WESTERN",
		아시안: "ASIAN",
	};

	return mapping[normalized] ?? normalized.toUpperCase();
};

const parsePreferenceTokens = (value: string): string[] => {
	return value
		.split(",")
		.map((token) => normalizePreferenceToken(token))
		.filter(Boolean);
};

export const GATHERING_SEED: GatheringItem[] = [
	{
		id: 1,
		createdAt: "2026-02-16T16:03:33.731Z",
		updatedAt: "2026-02-16T16:03:33.731Z",
		deletedAt: null,
		accessKey: "7372aa49ff43",
		peopleCount: 10,
		region: "HONGDAE",
		scheduledDate: "2026-03-03",
		timeSlot: "DINNER",
		title: null,
	},
	{
		id: 2,
		createdAt: "2026-02-16T15:38:11.564Z",
		updatedAt: "2026-02-16T15:38:11.564Z",
		deletedAt: null,
		accessKey: "9226479de98d",
		peopleCount: 4,
		region: "GONGDEOK",
		scheduledDate: "2026-03-12",
		timeSlot: "DINNER",
		title: null,
	},
];

export const PARTICIPANT_SEED: ParticipantItem[] = [
	{
		id: 1,
		createdAt: "2026-02-16T16:31:47.562Z",
		updatedAt: "2026-02-16T16:31:47.562Z",
		gatheringId: 2,
		nickname: "백루키",
		role: "MEMBER",
		distanceRange: "RANGE_1KM",
		preferences: parsePreferenceTokens("CHINESE,JAPANESE,ANY"),
		dislikes: "KOREAN",
	},
	{
		id: 2,
		createdAt: "2026-02-17T15:47:46.621Z",
		updatedAt: "2026-02-17T15:47:46.621Z",
		gatheringId: 7,
		nickname: "윤범차",
		role: "MEMBER",
		distanceRange: "RANGE_500M",
		preferences: parsePreferenceTokens("한식,일식,중식"),
		dislikes: "ANY",
	},
];

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

const nowIso = () => new Date().toISOString();

type AdminMockState = {
	categories: InternalCategory[];
	gatherings: GatheringItem[];
	participants: ParticipantItem[];
	restaurants: RestaurantDetail[];
};

const createInitialState = (): AdminMockState => ({
	categories: clone(CATEGORY_SEED),
	gatherings: clone(GATHERING_SEED),
	participants: clone(PARTICIPANT_SEED),
	restaurants: clone(RESTAURANT_SEED),
});

let state = createInitialState();

const toListItem = (restaurant: RestaurantDetail): RestaurantListItem => ({
	id: restaurant.id,
	name: restaurant.name,
	categoryId: restaurant.categoryId,
	rating: restaurant.rating,
	imageUrl: restaurant.imageUrl,
	region: restaurant.region,
	updatedAt: restaurant.updatedAt,
});

const includeByKeyword = (
	restaurant: RestaurantDetail,
	keyword: string | undefined,
) => {
	if (!keyword?.trim()) {
		return true;
	}

	const normalized = keyword.trim().toLowerCase();
	const searchableText = [
		restaurant.name,
		restaurant.address,
		restaurant.description,
		restaurant.representMenu,
	]
		.join(" ")
		.toLowerCase();

	return searchableText.includes(normalized);
};

const includeByRegion = (
	restaurant: RestaurantDetail,
	region: string | undefined,
) => {
	if (!region || region === "ALL") {
		return true;
	}

	return restaurant.region === region;
};

const includeByCategory = (
	restaurant: RestaurantDetail,
	categoryId: number | undefined,
) => {
	if (typeof categoryId !== "number") {
		return true;
	}

	return restaurant.categoryId === categoryId;
};

const includeByLargeCategory = (
	restaurant: RestaurantDetail,
	largeCategory: string | undefined,
	categories: InternalCategory[],
) => {
	if (!largeCategory || largeCategory === "ALL") {
		return true;
	}

	const categoryId = restaurant.categoryId;
	if (typeof categoryId !== "number") {
		return false;
	}

	const foundCategory = categories.find(
		(category) => category.id === categoryId,
	);
	if (!foundCategory?.largeCategory) {
		return false;
	}

	return foundCategory.largeCategory === largeCategory;
};

const paginate = <T>(
	rows: T[],
	page: number,
	size: number,
): PageResponse<T> => {
	const safePage = Math.max(page, 0);
	const safeSize = Math.max(size, 1);
	const totalElements = rows.length;
	const totalPages = Math.max(Math.ceil(totalElements / safeSize), 1);
	const startIndex = safePage * safeSize;
	const endIndex = startIndex + safeSize;
	const content = rows.slice(startIndex, endIndex);

	return {
		content,
		page: safePage,
		size: safeSize,
		totalElements,
		totalPages,
		hasNext: safePage < totalPages - 1,
	};
};

const updateRestaurantFields = (
	current: RestaurantDetail,
	patch: RestaurantPatchRequest,
): RestaurantDetail => {
	const sanitizedPatch = Object.fromEntries(
		Object.entries(patch).filter(
			([, value]) => typeof value !== "undefined",
		),
	) as RestaurantPatchRequest;

	return {
		...current,
		...sanitizedPatch,
		updatedAt: nowIso(),
	};
};

const toParticipantCountByGathering = (
	participants: ParticipantItem[],
): Map<number, number> => {
	return participants.reduce((acc, participant) => {
		if (typeof participant.gatheringId !== "number") {
			return acc;
		}

		acc.set(
			participant.gatheringId,
			(acc.get(participant.gatheringId) ?? 0) + 1,
		);
		return acc;
	}, new Map<number, number>());
};

const includeGatheringByKeyword = (
	gathering: GatheringItem,
	keyword: string | undefined,
) => {
	if (!keyword?.trim()) {
		return true;
	}

	const normalized = keyword.trim().toLowerCase();
	const title = gathering.title?.toLowerCase() ?? "";
	const accessKey = gathering.accessKey.toLowerCase();
	const idText = String(gathering.id);

	return (
		title.includes(normalized) ||
		accessKey.includes(normalized) ||
		idText.includes(normalized)
	);
};

const includeGatheringByRegion = (
	gathering: GatheringItem,
	region: string | undefined,
) => {
	if (!region || region === "ALL") {
		return true;
	}

	return gathering.region === region;
};

const includeGatheringByTimeSlot = (
	gathering: GatheringItem,
	timeSlot: string | undefined,
) => {
	if (!timeSlot || timeSlot === "ALL") {
		return true;
	}

	return gathering.timeSlot === timeSlot;
};

const includeGatheringByDeletedStatus = (
	gathering: GatheringItem,
	includeDeleted: boolean | undefined,
) => {
	if (includeDeleted) {
		return true;
	}

	return gathering.deletedAt === null;
};

const toFillRate = (participantCount: number, peopleCount: number): number => {
	if (peopleCount <= 0) {
		return 0;
	}

	return Number(((participantCount / peopleCount) * 100).toFixed(1));
};

const toGatheringListItem = (
	gathering: GatheringItem,
	participantCountByGathering: Map<number, number>,
): GatheringListItem => {
	const participantCount = participantCountByGathering.get(gathering.id) ?? 0;
	return {
		id: gathering.id,
		title: gathering.title,
		accessKey: gathering.accessKey,
		scheduledDate: gathering.scheduledDate,
		timeSlot: gathering.timeSlot,
		region: gathering.region,
		peopleCount: gathering.peopleCount,
		participantCount,
		fillRate: toFillRate(participantCount, gathering.peopleCount),
		deletedAt: gathering.deletedAt,
		updatedAt: gathering.updatedAt,
	};
};

const buildGatheringDataIssues = (
	gatherings: GatheringItem[],
	participants: ParticipantItem[],
): DataIssue[] => {
	const issues: DataIssue[] = [];
	const gatheringIdSet = new Set(gatherings.map((gathering) => gathering.id));
	const participantCountByGathering =
		toParticipantCountByGathering(participants);

	gatherings.forEach((gathering) => {
		if (!GATHERING_ALLOWED_REGIONS.has(gathering.region)) {
			issues.push({
				id: `region-${gathering.id}`,
				severity: "WARN",
				title: "모임 지역 값 검증 필요",
				description: `모임 #${gathering.id} region(${gathering.region})이 서버 체크 제약과 다릅니다.`,
				relatedId: gathering.id,
			});
		}

		if (!GATHERING_ALLOWED_TIME_SLOTS.has(gathering.timeSlot)) {
			issues.push({
				id: `time-slot-${gathering.id}`,
				severity: "WARN",
				title: "모임 시간대 값 검증 필요",
				description: `모임 #${gathering.id} timeSlot(${gathering.timeSlot})이 서버 체크 제약과 다릅니다.`,
				relatedId: gathering.id,
			});
		}

		const participantCount =
			participantCountByGathering.get(gathering.id) ?? 0;
		if (participantCount > gathering.peopleCount) {
			issues.push({
				id: `capacity-${gathering.id}`,
				severity: "ERROR",
				title: "모임 인원 초과",
				description: `모임 #${gathering.id} 참여자(${participantCount})가 peopleCount(${gathering.peopleCount})를 초과합니다.`,
				relatedId: gathering.id,
			});
		}
	});

	participants.forEach((participant) => {
		if (
			typeof participant.gatheringId !== "number" ||
			!gatheringIdSet.has(participant.gatheringId)
		) {
			issues.push({
				id: `orphan-${participant.id}`,
				severity: "ERROR",
				title: "연결되지 않은 참여자",
				description: `참여자 #${
					participant.id
				}가 존재하지 않는 모임(gatheringId=${
					participant.gatheringId ?? "-"
				})을 참조합니다.`,
				relatedId: participant.id,
			});
		}
	});

	if (issues.length === 0) {
		issues.push({
			id: "health-ok",
			severity: "INFO",
			title: "데이터 상태 정상",
			description: "현재 탐지된 데이터 정합성 이슈가 없습니다.",
		});
	}

	return issues;
};

export const adminMockDb = {
	reset() {
		state = createInitialState();
	},

	login({ password, loginId }: LoginRequest): AdminSession {
		if (
			loginId.trim() !== LOGIN_CREDENTIALS.loginId ||
			password !== LOGIN_CREDENTIALS.password
		) {
			throw new Error("아이디 또는 비밀번호가 올바르지 않습니다.");
		}

		const expiresAt = new Date(Date.now() + 1000 * 60 * 60).toISOString();
		const seed = Date.now();

		return {
			adminId: "admin-1",
			name: "Yogieat Admin",
			roles: ["ADMIN"],
			tokenBundle: {
				accessToken: `mock-access-${seed}`,
				refreshToken: `mock-refresh-${seed}`,
				expiresAt,
			},
		};
	},

	getCategories(): CategoryOption[] {
		return clone(state.categories).map((category) => ({
			...category,
			name: category.mediumCategory,
		}));
	},

	getGatheringDashboard(): GatheringDashboardData {
		const gatherings = clone(state.gatherings).sort((a, b) =>
			a.scheduledDate.localeCompare(b.scheduledDate),
		);
		const participants = clone(state.participants).sort((a, b) =>
			b.updatedAt.localeCompare(a.updatedAt),
		);
		const issues = buildGatheringDataIssues(gatherings, participants);

		return {
			generatedAt: nowIso(),
			gatherings,
			participants,
			issues,
		};
	},

	getGatherings(query: GatheringListQuery): PageResponse<GatheringListItem> {
		const participantCountByGathering = toParticipantCountByGathering(
			state.participants,
		);

		const rows = clone(state.gatherings)
			.filter((gathering) =>
				includeGatheringByDeletedStatus(
					gathering,
					query.includeDeleted,
				),
			)
			.filter((gathering) =>
				includeGatheringByKeyword(gathering, query.keyword),
			)
			.filter((gathering) =>
				includeGatheringByRegion(gathering, query.region),
			)
			.filter((gathering) =>
				includeGatheringByTimeSlot(gathering, query.timeSlot),
			)
			.sort((a, b) => a.scheduledDate.localeCompare(b.scheduledDate))
			.map((gathering) =>
				toGatheringListItem(gathering, participantCountByGathering),
			);

		return paginate(rows, query.page, query.size);
	},

	getGatheringById(id: number): GatheringDetail | null {
		const gathering = state.gatherings.find((item) => item.id === id);
		if (!gathering) {
			return null;
		}

		const participants = state.participants
			.filter((participant) => participant.gatheringId === id)
			.map((participant) => clone(participant))
			.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
		const participantCount = participants.length;

		return {
			gathering: clone(gathering),
			participants,
			participantCount,
			fillRate: toFillRate(participantCount, gathering.peopleCount),
		};
	},

	getRestaurants(
		query: RestaurantListQuery,
	): PageResponse<RestaurantListItem> {
		const filtered = state.restaurants
			.filter((restaurant) => includeByKeyword(restaurant, query.keyword))
			.filter((restaurant) => includeByRegion(restaurant, query.region))
			.filter((restaurant) =>
				includeByLargeCategory(
					restaurant,
					query.largeCategory,
					state.categories,
				),
			)
			.filter((restaurant) =>
				includeByCategory(restaurant, query.categoryId),
			)
			.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
			.map(toListItem);

		return paginate(filtered, query.page, query.size);
	},

	getRestaurantById(id: number): RestaurantDetail | null {
		const found = state.restaurants.find(
			(restaurant) => restaurant.id === id,
		);
		return found ? clone(found) : null;
	},

	updateRestaurant(
		id: number,
		patch: RestaurantPatchRequest,
	): RestaurantDetail {
		const targetIndex = state.restaurants.findIndex(
			(restaurant) => restaurant.id === id,
		);

		if (targetIndex < 0) {
			throw new Error("맛집 정보를 찾을 수 없습니다.");
		}

		const updated = updateRestaurantFields(
			state.restaurants[targetIndex],
			patch,
		);
		state.restaurants[targetIndex] = updated;

		return clone(updated);
	},

	syncRestaurant(id: number): SyncResult {
		const targetIndex = state.restaurants.findIndex(
			(restaurant) => restaurant.id === id,
		);

		if (targetIndex < 0) {
			throw new Error("동기화할 맛집 정보를 찾을 수 없습니다.");
		}

		state.restaurants[targetIndex] = {
			...state.restaurants[targetIndex],
			reviewCount: (state.restaurants[targetIndex].reviewCount ?? 0) + 1,
			updatedAt: nowIso(),
		};

		const startedAt = nowIso();

		return {
			jobId: `sync-${id}-${Date.now()}`,
			status: "COMPLETED",
			startedAt,
			finishedAt: nowIso(),
			message: `맛집 #${id} 동기화가 완료되었습니다.`,
		};
	},

	syncAllRestaurants(): SyncResult {
		const startedAt = nowIso();

		state.restaurants = state.restaurants.map((restaurant) => ({
			...restaurant,
			updatedAt: nowIso(),
		}));

		return {
			jobId: `sync-all-${Date.now()}`,
			status: "COMPLETED",
			startedAt,
			finishedAt: nowIso(),
			message: `전체 ${state.restaurants.length}건 동기화가 완료되었습니다.`,
		};
	},
};

export const resetAdminMockData = () => {
	adminMockDb.reset();
};
