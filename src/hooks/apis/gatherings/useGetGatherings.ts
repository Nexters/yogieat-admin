import { useQuery } from "@tanstack/react-query";

import {
	gatheringQueryOptions,
	type GatheringListQuery,
} from "#/apis/gatherings";

export const useGetGatherings = (query: GatheringListQuery) => {
	return useQuery(gatheringQueryOptions.list(query));
};
