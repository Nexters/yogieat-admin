import { queryOptions } from "@tanstack/react-query";

import {
	getGatheringById,
	getGatheringDashboard,
	getGatherings,
} from "#/apis/gatherings/api";
import { gatheringKeys } from "#/apis/gatherings/queryKey";
import type { GatheringListQuery } from "#/apis/gatherings/type";

export const gatheringQueryOptions = {
	dashboard: () =>
		queryOptions({
			queryKey: gatheringKeys.dashboard(),
			queryFn: getGatheringDashboard,
		}),
	list: (query: GatheringListQuery) =>
		queryOptions({
			queryKey: gatheringKeys.list(query),
			queryFn: () => getGatherings(query),
		}),
	detail: (id: number) =>
		queryOptions({
			queryKey: gatheringKeys.detail(id),
			queryFn: () => getGatheringById(id),
		}),
};
