export const regionKeys = {
	all: ["regions"] as const,
	lists: () => [...regionKeys.all, "list"] as const,
	list: () => [...regionKeys.lists()] as const,
	details: () => [...regionKeys.all, "detail"] as const,
	detail: (id: number) => [...regionKeys.details(), id] as const,
};
