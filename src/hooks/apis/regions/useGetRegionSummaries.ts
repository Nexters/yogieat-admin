import { useQuery } from "@tanstack/react-query";

import { regionQueryOptions } from "#/apis/regions";

export const useGetRegionSummaries = () => {
	return useQuery(regionQueryOptions.list());
};
