import { adminService } from "#/apis/admin";
import type {
	GatheringDashboardData,
	GatheringDetail,
	GatheringListItem,
	GatheringListQuery,
	PageResponse,
} from "#/apis/gatherings/type";

export const getGatheringDashboard = (): Promise<GatheringDashboardData> => {
	return adminService.getGatheringDashboard();
};

export const getGatherings = (
	query: GatheringListQuery,
): Promise<PageResponse<GatheringListItem>> => {
	return adminService.getGatherings(query);
};

export const getGatheringById = (
	id: number,
): Promise<GatheringDetail | null> => {
	return adminService.getGatheringById(id);
};
