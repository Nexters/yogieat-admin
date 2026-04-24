import { useQuery } from "@tanstack/react-query";

import { regionQueryOptions, type RegionListQuery } from "#/apis/regions";

export const useGetRegionSummaries = (query?: RegionListQuery) => {
	return useQuery(regionQueryOptions.list(query));
};
