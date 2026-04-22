import { queryOptions } from "@tanstack/react-query";

import { getRegionById, getRegionSummaries } from "#/apis/regions/api";
import { regionKeys } from "#/apis/regions/queryKey";

export const regionQueryOptions = {
	list: () =>
		queryOptions({
			queryKey: regionKeys.list(),
			queryFn: getRegionSummaries,
		}),
	detail: (id: number) =>
		queryOptions({
			queryKey: regionKeys.detail(id),
			queryFn: () => getRegionById(id),
		}),
};
