import { useQuery } from "@tanstack/react-query";

import { gatheringQueryOptions } from "#/apis/gatherings";

export const useGetGatheringById = (id: number, enabled = true) => {
	return useQuery({
		...gatheringQueryOptions.detail(id),
		enabled,
	});
};
