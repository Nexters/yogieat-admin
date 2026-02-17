import { APP_ENV } from "../../shared/config/env";
import { AdminService } from "./types";
import { resetAdminMockData as resetMockData } from "../../mocks/admin-db";
import { localAdminService } from "./local-admin-service";

export const ADMIN_API_MODE = APP_ENV.USE_MOCK_API ? "mock" : "real";

const resolveAdminService = (): AdminService => {
	if (ADMIN_API_MODE === "mock") {
		return localAdminService;
	}

	// TODO(api-integration): 실 API 연동 시 REACT_APP_USE_MOCK_API=false 로 전환하면
	// 아래 realAdminService 로드 경로가 활성화됩니다.
	const { realAdminService } =
		require("./real-admin-service") as typeof import("./real-admin-service");
	return realAdminService;
};

export const adminService: AdminService = resolveAdminService();

export const resetAdminMockData = () => {
	if (ADMIN_API_MODE === "mock") {
		resetMockData();
	}
};
