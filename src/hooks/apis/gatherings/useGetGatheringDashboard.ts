import { useQuery } from "@tanstack/react-query";

import { gatheringQueryOptions } from "#/apis/gatherings";

export const useGetGatheringDashboard = () => {
	return useQuery(gatheringQueryOptions.dashboard());
};
