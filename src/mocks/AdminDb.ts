import {
	AdminSession,
	CategoryOption,
	CreateRestaurantSyncJobResponse,
	DataIssue,
	GatheringDetail,
	GatheringDashboardData,
	GatheringItem,
	GatheringListItem,
	GatheringListQuery,
	GetRestaurantSyncJobResponse,
	LoginRequest,
	PageResponse,
	ParticipantItem,
	RegionCreateRequest,
	RegionDetail,
	RegionListResponse,
	RegionPatchRequest,
	RestaurantCreateRequest,
	RestaurantCreateResponse,
	RestaurantDetail,
	RestaurantListItem,
	RestaurantListQuery,
	RestaurantPatchRequest,
	RestaurantSearchResponse,
} from "#/apis/admin/types";
import type {
	RestaurantRegion,
	RestaurantRegionsResponse,
	RestaurantSearchItem,
} from "#/apis/restaurants";
import { REGION_CODES, REGION_LABEL_BY_CODE } from "#/shared/constants";

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
	{
		id: 5,
		externalId: "13575898",
		categoryId: 4,
		name: "수정된 맛집명",
		address: "서울 서초구 강남대로 435",
		rating: 4.8,
		imageUrl: "http://t1.daumcdn.net/cfile/166DC3354E4DE28425",
		mapUrl: "https://place.map.kakao.com/13575898",
		representativeReview:
			"김포공항에는 항상 사람 많았는데 강남점은 6시 퇴근하고 바로 갔는데 4팀정도만 있었고 금방 들어갔음.\n회전초밥 집이 사실 거기서 거기지만 다양한 메뉴가 많고 활어 메뉴가 많으면 갈만 한듯.\n그런점에서 갓덴스시는 가격대가 좀 있지만 갈만 하다.\n고등어도 안비리고 제철메뉴가 다양함.\n굴찜은 주문 들어오면 쪄주기 때문에 강추. 알이 크고 부드러움.\n새우는 다른데랑 비슷함.",
		description:
			"신선한 재료로 만든 다양한 초밥을 합리적인 가격에 즐길 수 있는 회전초밥 전문점입니다. 눈앞에서 셰프가 직접 초밥을 만들어줍니다.",
		region: "GANGNAM",
		location: {
			coordinates: [127.0276, 37.4979],
		},
		reviewCount: 369,
		blogReviewCount: 623,
		representMenu: "녹색접시",
		representMenuPrice: 1500,
		priceLevel: "₩₩₩",
		aiMateSummaryTitle: "신선함 가득한 회전초밥의 즐거움",
		aiMateSummaryContents: ["프라이빗룸"],
		timeSlot: "LUNCH",
		createdAt: "2026-02-16T03:04:45.122385",
		updatedAt: "2026-02-19T15:59:21.172007",
	},
];

const GATHERING_ALLOWED_REGIONS = new Set<string>(REGION_CODES);
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
		id: 11,
		createdAt: "2026-02-19T01:10:34.445364",
		updatedAt: "2026-02-19T01:10:34.445364",
		deletedAt: null,
		accessKey: "713284d84a61",
		peopleCount: 3,
		region: "GONGDEOK",
		scheduledDate: "2026-02-27",
		timeSlot: "DINNER",
		title: null,
	},
	{
		id: 10,
		createdAt: "2026-02-18T15:43:00.410446",
		updatedAt: "2026-02-18T15:43:00.410446",
		deletedAt: null,
		accessKey: "1fe5ebc9d72f",
		peopleCount: 2,
		region: "GANGNAM",
		scheduledDate: "2026-02-19",
		timeSlot: "DINNER",
		title: null,
	},
	{
		id: 9,
		createdAt: "2026-02-18T00:57:13.782593",
		updatedAt: "2026-02-18T00:57:13.782593",
		deletedAt: null,
		accessKey: "706abf16dbdc",
		peopleCount: 1,
		region: "GONGDEOK",
		scheduledDate: "2222-02-02",
		timeSlot: "DINNER",
		title: null,
	},
	{
		id: 8,
		createdAt: "2026-02-17T22:42:27.678486",
		updatedAt: "2026-02-17T22:42:27.678486",
		deletedAt: null,
		accessKey: "535f0b7ff73f",
		peopleCount: 2,
		region: "GANGNAM",
		scheduledDate: "2222-02-02",
		timeSlot: "DINNER",
		title: null,
	},
	{
		id: 7,
		createdAt: "2026-02-17T15:47:10.353532",
		updatedAt: "2026-02-17T15:47:10.353532",
		deletedAt: null,
		accessKey: "45507c69c99d",
		peopleCount: 1,
		region: "JONGNO3GA",
		scheduledDate: "2026-02-20",
		timeSlot: "DINNER",
		title: null,
	},
	{
		id: 6,
		createdAt: "2026-02-17T00:03:25.266977",
		updatedAt: "2026-02-17T00:03:25.266977",
		deletedAt: null,
		accessKey: "da9a6bab29c6",
		peopleCount: 9,
		region: "GONGDEOK",
		scheduledDate: "2026-02-28",
		timeSlot: "LUNCH",
		title: null,
	},
	{
		id: 5,
		createdAt: "2026-02-16T20:37:28.942752",
		updatedAt: "2026-02-16T20:37:28.942752",
		deletedAt: null,
		accessKey: "aec2f00bb909",
		peopleCount: 2,
		region: "GANGNAM",
		scheduledDate: "2026-02-17",
		timeSlot: "DINNER",
		title: null,
	},
	{
		id: 4,
		createdAt: "2026-02-16T20:23:19.837752",
		updatedAt: "2026-02-16T20:23:19.837752",
		deletedAt: null,
		accessKey: "25df3b101aa9",
		peopleCount: 2,
		region: "GANGNAM",
		scheduledDate: "2026-07-30",
		timeSlot: "DINNER",
		title: null,
	},
	{
		id: 3,
		createdAt: "2026-02-16T18:35:16.946246",
		updatedAt: "2026-02-16T18:35:16.946246",
		deletedAt: null,
		accessKey: "b2c853e72ab2",
		peopleCount: 3,
		region: "GANGNAM",
		scheduledDate: "2026-02-16",
		timeSlot: "DINNER",
		title: null,
	},
	{
		id: 1,
		createdAt: "2026-02-16T15:38:11.564744",
		updatedAt: "2026-02-16T15:38:11.564744",
		deletedAt: null,
		accessKey: "9226479de98d",
		peopleCount: 4,
		region: "GONGDEOK",
		scheduledDate: "2026-03-12",
		timeSlot: "DINNER",
		title: null,
	},
	{
		id: 2,
		createdAt: "2026-02-16T16:03:33.731773",
		updatedAt: "2026-02-16T16:03:33.731773",
		deletedAt: null,
		accessKey: "7372aa49ff43",
		peopleCount: 10,
		region: "HONGDAE",
		scheduledDate: "2026-03-03",
		timeSlot: "DINNER",
		title: null,
	},
];

const RESTAURANT_SEARCH_SEED: RestaurantSearchItem[] = [
	{
		externalId: "1797997961",
		placeName: "옥동식 서교점",
		addressName: "서울 마포구 서교동 385-6",
		roadAddressName: "서울 마포구 양화로7길 44-10",
		category: "음식점 > 한식 > 곰탕",
		x: "126.914521071507",
		y: "37.5526765694055",
	},
	{
		externalId: "995068389",
		placeName: "옥동식 송파하남",
		addressName: "경기 하남시 감일동 364",
		roadAddressName: "경기 하남시 감일로 17",
		category: "음식점 > 한식",
		x: "127.143162454953",
		y: "37.5077418714327",
	},
	{
		externalId: "991434192",
		placeName: "월하동",
		addressName: "서울 종로구 관훈동 29",
		roadAddressName: "서울 종로구 인사동8길 16-1",
		category: "음식점 > 한식 > 곰탕",
		x: "126.985978829845",
		y: "37.5742197688186",
	},
	{
		externalId: "20001001",
		placeName: "옥동식 홍대점",
		addressName: "서울 마포구 홍대입구 123-45",
		roadAddressName: "서울 마포구 와우산로 23",
		category: "음식점 > 한식 > 국수",
		x: "126.924521071507",
		y: "37.5556765694055",
	},
	{
		externalId: "20001002",
		placeName: "옥동식 강남점",
		addressName: "서울 강남구 역삼동 12-34",
		roadAddressName: "서울 강남구 강남대로 21",
		category: "음식점 > 한식 > 냉면",
		x: "127.0276",
		y: "37.4979",
	},
	{
		externalId: "20001003",
		placeName: "옥동식 명동점",
		addressName: "서울 중구 명동 1가 11-22",
		roadAddressName: "서울 중구 명동길 88",
		category: "음식점 > 한식 > 정식",
		x: "126.985",
		y: "37.563",
	},
];

const REGION_COORDINATES_BY_CODE: Record<string, [number, number]> = {
	EULJIRO3GA: [126.9919, 37.5663],
	GANGNAM: [127.028, 37.4981],
	GONGDEOK: [126.9522, 37.5445],
	HONGDAE: [126.9236, 37.5572],
	JAMSIL: [127.1027, 37.5133],
	JONGNO3GA: [126.9917, 37.5703],
	SADANG: [126.9816, 37.4766],
	SAMGAKJI: [126.9722, 37.5347],
};

const INACTIVE_REGION_CODE_SET = new Set(["SADANG", "SAMGAKJI"]);

const REGION_SEED: RegionDetail[] = REGION_CODES.map((regionCode, index) => ({
	id: index + 1,
	code: regionCode,
	displayName: REGION_LABEL_BY_CODE[regionCode] ?? regionCode,
	coordinatesStandard: {
		coordinates: REGION_COORDINATES_BY_CODE[regionCode] ?? [0, 0],
		type: "Point",
	},
	active: !INACTIVE_REGION_CODE_SET.has(regionCode),
	sortOrder: index,
	restaurantCount: RESTAURANT_SEED.filter(
		(restaurant) => restaurant.region === regionCode,
	).length,
}));

export const PARTICIPANT_SEED: ParticipantItem[] = [
	{
		id: 11,
		createdAt: null,
		updatedAt: null,
		gatheringId: 10,
		nickname: "백광인",
		role: "MEMBER",
		distanceRange: "RANGE_500M",
		preferences: parsePreferenceTokens("KOREAN,JAPANESE,ANY"),
		dislikes: "ASIAN",
	},
	{
		id: 10,
		createdAt: null,
		updatedAt: null,
		gatheringId: 9,
		nickname: "영민",
		role: "MEMBER",
		distanceRange: "RANGE_1KM",
		preferences: parsePreferenceTokens("ASIAN,CHINESE,ANY"),
		dislikes: "WESTERN,JAPANESE",
	},
	{
		id: 9,
		createdAt: null,
		updatedAt: null,
		gatheringId: 8,
		nickname: "위",
		role: "MEMBER",
		distanceRange: "RANGE_500M",
		preferences: parsePreferenceTokens("JAPANESE"),
		dislikes: "WESTERN",
	},
	{
		id: 8,
		createdAt: null,
		updatedAt: null,
		gatheringId: 7,
		nickname: "윤범차",
		role: "MEMBER",
		distanceRange: "RANGE_500M",
		preferences: parsePreferenceTokens("한식,일식,중식"),
		dislikes: "ANY",
	},
	{
		id: 4,
		createdAt: null,
		updatedAt: null,
		gatheringId: 2,
		nickname: "테스트삼번",
		role: "MEMBER",
		distanceRange: "RANGE_1KM",
		preferences: parsePreferenceTokens("ASIAN,CHINESE,ANY"),
		dislikes: "KOREAN",
	},
	{
		id: 5,
		createdAt: null,
		updatedAt: null,
		gatheringId: 2,
		nickname: "테스트이번",
		role: "MEMBER",
		distanceRange: "RANGE_500M",
		preferences: parsePreferenceTokens("JAPANESE,CHINESE"),
		dislikes: "ASIAN",
	},
	{
		id: 6,
		createdAt: null,
		updatedAt: null,
		gatheringId: 2,
		nickname: "백광인",
		role: "MEMBER",
		distanceRange: "RANGE_1KM",
		preferences: parsePreferenceTokens("CHINESE,JAPANESE,ANY"),
		dislikes: "WESTERN",
	},
	{
		id: 7,
		createdAt: null,
		updatedAt: null,
		gatheringId: 2,
		nickname: "백루키",
		role: "MEMBER",
		distanceRange: "RANGE_1KM",
		preferences: parsePreferenceTokens("CHINESE,JAPANESE,ANY"),
		dislikes: "KOREAN",
	},
	{
		id: 1,
		createdAt: null,
		updatedAt: null,
		gatheringId: 1,
		nickname: "테스트일번",
		role: "MEMBER",
		distanceRange: "RANGE_1KM",
		preferences: parsePreferenceTokens("WESTERN,JAPANESE,ASIAN"),
		dislikes: "KOREAN",
	},
	{
		id: 2,
		createdAt: null,
		updatedAt: null,
		gatheringId: 1,
		nickname: "테스트이번",
		role: "MEMBER",
		distanceRange: "RANGE_500M",
		preferences: parsePreferenceTokens("ASIAN,CHINESE"),
		dislikes: "JAPANESE",
	},
	{
		id: 3,
		createdAt: null,
		updatedAt: null,
		gatheringId: 1,
		nickname: "테스트삼번",
		role: "MEMBER",
		distanceRange: "RANGE_1KM",
		preferences: parsePreferenceTokens("CHINESE,JAPANESE"),
		dislikes: "ASIAN",
	},
];

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

const nowIso = () => new Date().toISOString();

type AdminMockState = {
	categories: InternalCategory[];
	gatherings: GatheringItem[];
	participants: ParticipantItem[];
	regions: RegionDetail[];
	restaurants: RestaurantDetail[];
	syncJobs: GetRestaurantSyncJobResponse[];
	nextSyncJobId: number;
};

const createInitialState = (): AdminMockState => ({
	categories: clone(CATEGORY_SEED),
	gatherings: clone(GATHERING_SEED),
	participants: clone(PARTICIPANT_SEED),
	regions: clone(REGION_SEED),
	restaurants: clone(RESTAURANT_SEED),
	syncJobs: [],
	nextSyncJobId: 1_000_000,
});

let state = createInitialState();

const REGION_CODE_PATTERN = /^[A-Z0-9_]+$/;
const MAX_REGION_CODE_LENGTH = 30;
const MAX_REGION_DISPLAY_NAME_LENGTH = 255;

const normalizeRegionCode = (value: string) => value.trim().toUpperCase();

const countRestaurantsByRegionCode = (regionCode: string) =>
	state.restaurants.filter((restaurant) => restaurant.region === regionCode)
		.length;

const sortRegions = (regions: RegionDetail[]) =>
	clone(regions).sort((left, right) => {
		if (left.sortOrder !== right.sortOrder) {
			return left.sortOrder - right.sortOrder;
		}

		return left.displayName.localeCompare(right.displayName, "ko");
	});

const hydrateRegion = (region: RegionDetail): RegionDetail => ({
	...clone(region),
	restaurantCount: countRestaurantsByRegionCode(region.code),
});

const toRestaurantRegion = (region: RegionDetail): RestaurantRegion => ({
	name: region.code,
	displayName: region.displayName,
	coordinatesStandard: {
		coordinates: region.coordinatesStandard.coordinates,
		type: "Point",
	},
});

const validateRegionCoordinates = (
	coordinatesStandard:
		| RegionCreateRequest["coordinatesStandard"]
		| RegionPatchRequest["coordinatesStandard"]
		| undefined,
) => {
	if (!coordinatesStandard || !Array.isArray(coordinatesStandard.coordinates)) {
		throw new Error("지역 좌표가 올바르지 않습니다.");
	}

	const [longitude, latitude] = coordinatesStandard.coordinates;
	if (
		typeof longitude !== "number" ||
		typeof latitude !== "number" ||
		!Number.isFinite(longitude) ||
		!Number.isFinite(latitude) ||
		longitude < -180 ||
		longitude > 180 ||
		latitude < -90 ||
		latitude > 90
	) {
		throw new Error("지역 좌표가 올바르지 않습니다.");
	}
};

const validateRegionCode = (
	code: string,
	currentRegionId?: number,
) => {
	if (!code) {
		throw new Error("지역 코드는 필수입니다.");
	}

	if (
		code.length > MAX_REGION_CODE_LENGTH ||
		!REGION_CODE_PATTERN.test(code)
	) {
		throw new Error(
			"지역 코드는 대문자, 숫자, 언더스코어만 사용할 수 있습니다.",
		);
	}

	const hasDuplicateCode = state.regions.some(
		(region) =>
			region.id !== currentRegionId && region.code === code,
	);
	if (hasDuplicateCode) {
		throw new Error("이미 존재하는 지역 코드입니다.");
	}
};

const validateRegionDisplayName = (
	displayName: string,
	currentRegionId?: number,
) => {
	if (!displayName) {
		throw new Error("지역명은 필수입니다.");
	}

	if (displayName.length > MAX_REGION_DISPLAY_NAME_LENGTH) {
		throw new Error(
			`지역명은 최대 ${MAX_REGION_DISPLAY_NAME_LENGTH}자까지 가능합니다.`,
		);
	}

	const hasDuplicateDisplayName = state.regions.some(
		(region) =>
			region.id !== currentRegionId &&
			region.displayName === displayName,
	);
	if (hasDuplicateDisplayName) {
		throw new Error("이미 존재하는 지역명입니다.");
	}
};

const validateRegionSortOrder = (sortOrder: number | undefined) => {
	if (
		typeof sortOrder === "number" &&
		(!Number.isInteger(sortOrder) || sortOrder < 0)
	) {
		throw new Error("sortOrder는 0 이상이어야 합니다.");
	}
};

const buildRegionSummary = (region: RegionDetail): RegionDetail => {
	return hydrateRegion(region);
};

const getNextRegionId = () => {
	return (
		state.regions.reduce((maxId, region) => Math.max(maxId, region.id), 0) +
		1
	);
};

const getNextRegionSortOrder = () => {
	return (
		state.regions.reduce(
			(maxSortOrder, region) => Math.max(maxSortOrder, region.sortOrder),
			-1,
		) + 1
	);
};

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

const normalizeSearchKeyword = (keyword: string | undefined): string => {
	const trimmed = keyword?.trim() ?? "";
	return trimmed;
};

const toSearchItemsByKeyword = (
	keyword: string,
): RestaurantSearchItem[] => {
	const normalizedKeyword = keyword.toLowerCase();
	const filtered = RESTAURANT_SEARCH_SEED.filter((item) =>
		[
			item.placeName,
			item.addressName,
			item.roadAddressName,
			item.category,
			item.externalId,
		]
			.join(" ")
			.toLowerCase()
			.includes(normalizedKeyword),
	);

	return filtered.slice(0, 5);
};

const toRestaurantLocationFromSearchItem = (
	searchItem: RestaurantSearchItem,
): { coordinates: [number, number] } | null => {
	const x = Number.parseFloat(searchItem.x);
	const y = Number.parseFloat(searchItem.y);
	if (!Number.isFinite(x) || !Number.isFinite(y)) {
		return null;
	}

	return { coordinates: [x, y] };
};

const createRestaurantId = (restaurants: RestaurantDetail[]) =>
	(restaurants.reduce((acc, restaurant) => Math.max(acc, restaurant.id), 0) || 0) + 1;

const createRestaurantSyncJob = (
	scope: GetRestaurantSyncJobResponse["scope"],
	targetRestaurantId: number | null,
	totalCount: number,
): GetRestaurantSyncJobResponse => {
	const now = nowIso();
	return {
		jobId: state.nextSyncJobId++,
		scope,
		triggerType: "MANUAL",
		status: "COMPLETED",
		targetRestaurantId,
		chunkSize: 100,
		parallelism: 1,
		totalCount,
		processedCount: totalCount,
		successCount: totalCount,
		failedCount: 0,
		errorSummary: null,
		startedAt: now,
		finishedAt: now,
		createdAt: now,
		updatedAt: now,
	};
};

const persistSyncJob = (job: GetRestaurantSyncJobResponse): GetRestaurantSyncJobResponse => {
	state.syncJobs = [job, ...state.syncJobs];
	return clone(job);
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

	return Number((participantCount / peopleCount).toFixed(1));
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
		return issues;
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
		const participantCountByGathering = toParticipantCountByGathering(
			state.participants,
		);
		const gatherings = clone(state.gatherings)
			.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
			.map((gathering) => {
				const participantCount =
					participantCountByGathering.get(gathering.id) ?? 0;

				return {
					...gathering,
					participantCount,
					fillRate: toFillRate(participantCount, gathering.peopleCount),
				};
			});
		const participants = clone(state.participants).sort((a, b) =>
			b.gatheringId !== a.gatheringId
				? (b.gatheringId ?? 0) - (a.gatheringId ?? 0)
				: a.id - b.id,
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
			.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
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
			.sort((a, b) => a.id - b.id);
		const participantCount = participants.length;
		const fillRate = toFillRate(participantCount, gathering.peopleCount);

		return {
			gathering: {
				...clone(gathering),
				participantCount,
				fillRate,
			},
			participants,
			participantCount,
			fillRate,
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

	searchRestaurants(keyword: string): RestaurantSearchResponse {
		const normalized = normalizeSearchKeyword(keyword);
		return {
			keyword: normalized,
			items: normalized.length > 0 ? toSearchItemsByKeyword(normalized) : [],
		};
	},

	createRestaurant(
		request: RestaurantCreateRequest,
	): RestaurantCreateResponse {
		const externalId = request.externalId.trim();
		const region = normalizeRegionCode(request.region);
		if (!externalId || !region) {
			throw new Error("externalId와 region은 필수입니다.");
		}

		const category = state.categories.find(
			(category) => category.id === request.categoryId,
		);
		if (!category) {
			throw new Error("유효하지 않은 categoryId입니다.");
		}

		const foundRegion = state.regions.find(
			(regionItem) => regionItem.code === region,
		);
		if (!foundRegion) {
			throw new Error("유효하지 않은 지역 코드입니다.");
		}

		const duplicate = state.restaurants.find(
			(restaurant) => restaurant.externalId === externalId,
		);
		if (duplicate) {
			return {
				restaurantId: duplicate.id,
				duplicated: true,
			};
		}

		const matchedSearchItem = RESTAURANT_SEARCH_SEED.find(
			(item) => item.externalId === externalId,
		);
		const location = matchedSearchItem
			? toRestaurantLocationFromSearchItem(matchedSearchItem)
			: null;
		const now = nowIso();
		const nextId = createRestaurantId(state.restaurants);
		const created: RestaurantDetail = {
			id: nextId,
			externalId,
			categoryId: request.categoryId,
			name: matchedSearchItem?.placeName ?? `맛집 ${externalId}`,
			address: matchedSearchItem?.addressName ?? "",
			rating: null,
			imageUrl:
				"http://t1.daumcdn.net/local/placeholder.jpg",
			mapUrl: `https://place.map.kakao.com/${externalId}`,
			representativeReview: "",
			description: request.description?.trim() ?? "",
			region,
			location: location ? { coordinates: location.coordinates } : null,
			reviewCount: 0,
			blogReviewCount: 0,
			representMenu: "",
			representMenuPrice: null,
			priceLevel: "",
			aiMateSummaryTitle: "",
			aiMateSummaryContents: [],
			timeSlot: "BOTH",
			createdAt: now,
			updatedAt: now,
		};

		state.restaurants = [created, ...state.restaurants];

		return {
			restaurantId: created.id,
			duplicated: false,
		};
	},

	deleteRestaurant(id: number): void {
		const targetIndex = state.restaurants.findIndex(
			(restaurant) => restaurant.id === id,
		);
		if (targetIndex < 0) {
			throw new Error("해당 맛집을 찾을 수 없습니다.");
		}

		state.restaurants = [
			...state.restaurants.slice(0, targetIndex),
			...state.restaurants.slice(targetIndex + 1),
		];
	},

	getRegions(): RestaurantRegionsResponse {
		return {
			regions: sortRegions(state.regions).map((region) =>
				toRestaurantRegion(buildRegionSummary(region)),
			),
		};
	},

	getRegionSummaries(): RegionListResponse {
		return {
			regions: sortRegions(state.regions).map((region) =>
				buildRegionSummary(region),
			),
		};
	},

	getRegionById(id: number): RegionDetail | null {
		const found = state.regions.find((region) => region.id === id);
		return found ? buildRegionSummary(found) : null;
	},

	createRegion(request: RegionCreateRequest): RegionDetail {
		const code = normalizeRegionCode(request.code ?? "");
		const displayName = request.displayName?.trim() ?? "";
		const sortOrder =
			typeof request.sortOrder === "number"
				? request.sortOrder
				: getNextRegionSortOrder();

		validateRegionCode(code);
		validateRegionDisplayName(displayName);
		validateRegionCoordinates(request.coordinatesStandard);
		validateRegionSortOrder(sortOrder);

		const created: RegionDetail = {
			id: getNextRegionId(),
			code,
			displayName,
			coordinatesStandard: {
				coordinates: [
					request.coordinatesStandard.coordinates[0],
					request.coordinatesStandard.coordinates[1],
				],
				type: "Point",
			},
			active: request.active ?? true,
			sortOrder,
			restaurantCount: 0,
		};

		state.regions = [...state.regions, created];
		return buildRegionSummary(created);
	},

	updateRegion(id: number, patch: RegionPatchRequest): RegionDetail {
		const targetIndex = state.regions.findIndex((region) => region.id === id);
		if (targetIndex < 0) {
			throw new Error("지역 정보를 찾을 수 없습니다.");
		}

		const currentRegion = state.regions[targetIndex];
		const nextCode =
			typeof patch.code === "string"
				? normalizeRegionCode(patch.code)
				: currentRegion.code;
		const nextDisplayName =
			typeof patch.displayName === "string"
				? patch.displayName.trim()
				: currentRegion.displayName;
		const nextSortOrder =
			typeof patch.sortOrder === "number"
				? patch.sortOrder
				: currentRegion.sortOrder;

		validateRegionCode(nextCode, id);
		validateRegionDisplayName(nextDisplayName, id);
		validateRegionSortOrder(nextSortOrder);
		if (patch.coordinatesStandard) {
			validateRegionCoordinates(patch.coordinatesStandard);
		}

		const updated: RegionDetail = {
			...currentRegion,
			code: nextCode,
			displayName: nextDisplayName,
			coordinatesStandard: patch.coordinatesStandard
				? {
						coordinates: [
							patch.coordinatesStandard.coordinates[0],
							patch.coordinatesStandard.coordinates[1],
						],
						type: "Point",
					}
				: currentRegion.coordinatesStandard,
			active:
				typeof patch.active === "boolean"
					? patch.active
					: currentRegion.active,
			sortOrder: nextSortOrder,
		};

		state.regions[targetIndex] = updated;

		if (currentRegion.code !== updated.code) {
			state.restaurants = state.restaurants.map((restaurant) =>
				restaurant.region === currentRegion.code
					? {
							...restaurant,
							region: updated.code,
							updatedAt: nowIso(),
						}
					: restaurant,
			);
		}

		return buildRegionSummary(updated);
	},

	deleteRegion(id: number): void {
		const targetIndex = state.regions.findIndex((region) => region.id === id);
		if (targetIndex < 0) {
			throw new Error("삭제할 지역 정보를 찾을 수 없습니다.");
		}

		const target = state.regions[targetIndex];
		if (countRestaurantsByRegionCode(target.code) > 0) {
			throw new Error("맛집이 연결된 지역은 삭제할 수 없습니다.");
		}

		state.regions = [
			...state.regions.slice(0, targetIndex),
			...state.regions.slice(targetIndex + 1),
		];
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

	syncRestaurant(id: number): CreateRestaurantSyncJobResponse {
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

		const created = createRestaurantSyncJob("SINGLE", id, 1);
		return persistSyncJob(created);
	},

	syncAllRestaurants(): CreateRestaurantSyncJobResponse {
		state.restaurants = state.restaurants.map((restaurant) => ({
			...restaurant,
			updatedAt: nowIso(),
		}));
		const created = createRestaurantSyncJob(
			"ALL",
			null,
			state.restaurants.length,
		);
		return persistSyncJob(created);
	},

	getSyncRestaurantJob(jobId: number): GetRestaurantSyncJobResponse {
		const found = state.syncJobs.find((job) => job.jobId === jobId);
		if (!found) {
			throw new Error("해당 동기화 Job을 찾을 수 없습니다.");
		}

		return clone(found);
	},
};

export const resetAdminMockData = () => {
	adminMockDb.reset();
};
