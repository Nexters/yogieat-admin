import { useQuery } from "@tanstack/react-query";

import { restaurantQueryOptions } from "#/apis/restaurants";

export const useGetSyncRestaurantJob = (
	jobId: number,
	enabled = true,
) => {
	return useQuery({
		...restaurantQueryOptions.syncJob(jobId),
		enabled,
	});
};
