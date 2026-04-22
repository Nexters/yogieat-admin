import { adminService } from "#/apis/admin";
import type {
	RegionCreateRequest,
	RegionDetail,
	RegionListResponse,
	RegionPatchRequest,
} from "#/apis/regions/type";

export const getRegionSummaries = (): Promise<RegionListResponse> => {
	return adminService.getRegionSummaries();
};

export const getRegionById = (id: number): Promise<RegionDetail | null> => {
	return adminService.getRegionById(id);
};

export const createRegion = (
	request: RegionCreateRequest,
): Promise<RegionDetail> => {
	return adminService.createRegion(request);
};

export const updateRegion = (
	id: number,
	patch: RegionPatchRequest,
): Promise<RegionDetail> => {
	return adminService.updateRegion(id, patch);
};

export const deleteRegion = (id: number): Promise<void> => {
	return adminService.deleteRegion(id);
};
