import { queryOptions } from "@tanstack/react-query";

import { getRegionById, getRegionSummaries } from "#/apis/regions/api";
import { regionKeys } from "#/apis/regions/queryKey";
import type { RegionListQuery } from "#/apis/regions/type";

export const regionQueryOptions = {
	list: (query?: RegionListQuery) =>
		queryOptions({
			queryKey: regionKeys.list(query?.province),
			queryFn: () => getRegionSummaries(query),
		}),
	detail: (id: number) =>
		queryOptions({
			queryKey: regionKeys.detail(id),
			queryFn: () => getRegionById(id),
		}),
};
