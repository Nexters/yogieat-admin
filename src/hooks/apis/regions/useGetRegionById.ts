import { useQuery } from "@tanstack/react-query";

import { regionQueryOptions } from "#/apis/regions";

export const useGetRegionById = (id: number, enabled = true) => {
	return useQuery({
		...regionQueryOptions.detail(id),
		enabled,
	});
};
