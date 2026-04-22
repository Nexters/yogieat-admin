import { mutationOptions } from "@tanstack/react-query";

import {
	createRegion,
	deleteRegion,
	updateRegion,
} from "#/apis/regions/api";
import { regionKeys } from "#/apis/regions/queryKey";
import type { RegionPatchRequest } from "#/apis/regions/type";

export const regionMutationOptions = {
	create: () =>
		mutationOptions({
			mutationKey: [...regionKeys.all, "create"] as const,
			mutationFn: createRegion,
		}),
	update: () =>
		mutationOptions({
			mutationKey: [...regionKeys.all, "update"] as const,
			mutationFn: ({
				id,
				patch,
			}: {
				id: number;
				patch: RegionPatchRequest;
			}) => updateRegion(id, patch),
		}),
	deleteById: () =>
		mutationOptions({
			mutationKey: [...regionKeys.all, "delete"] as const,
			mutationFn: (id: number) => deleteRegion(id),
		}),
};
