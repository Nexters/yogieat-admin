export const regionKeys = {
	all: ["regions"] as const,
	lists: () => [...regionKeys.all, "list"] as const,
	list: (province?: string) => [...regionKeys.lists(), { province }] as const,
	details: () => [...regionKeys.all, "detail"] as const,
	detail: (id: number) => [...regionKeys.details(), id] as const,
};
