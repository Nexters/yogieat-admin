import type { GatheringListQuery } from "#/apis/gatherings/type";

export const gatheringKeys = {
	all: ["gatherings"] as const,
	dashboard: () => [...gatheringKeys.all, "dashboard"] as const,
	lists: () => [...gatheringKeys.all, "list"] as const,
	list: (query: GatheringListQuery) =>
		[...gatheringKeys.lists(), query] as const,
	details: () => [...gatheringKeys.all, "detail"] as const,
	detail: (id: number) => [...gatheringKeys.details(), id] as const,
};
