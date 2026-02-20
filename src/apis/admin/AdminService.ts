import { localAdminService } from "#/apis/admin/LocalAdminService";
import { AdminService } from "#/apis/admin/types";
import { resetAdminMockData as resetMockData } from "#/mocks/AdminDb";
import { APP_ENV } from "#/shared/config/env";

export const ADMIN_API_MODE = APP_ENV.USE_MOCK_API ? "mock" : "real";

type AdminApiMode = "mock" | "real";

const resolveAdminService = (mode: AdminApiMode): AdminService => {
	if (mode === "mock") {
		return localAdminService;
	}

	// TODO(api-integration): 실 API 연동 시 REACT_APP_USE_MOCK_API=false 로 전환하면
	// 아래 realAdminService 로드 경로가 활성화됩니다.
	const { realAdminService } =
		require("#/apis/admin/RealAdminService") as typeof import("#/apis/admin/RealAdminService");
	return realAdminService;
};

const resolveInitialMode = (): AdminApiMode => ADMIN_API_MODE;
let currentMode = resolveInitialMode();
export let adminService: AdminService = resolveAdminService(currentMode);

export const setAdminServiceMode = (mode: AdminApiMode): void => {
	if (mode === currentMode) {
		return;
	}
	currentMode = mode;
	adminService = resolveAdminService(currentMode);
};

export const getAdminServiceMode = (): AdminApiMode => currentMode;

export const resetAdminMockData = () => {
	if (currentMode === "mock") {
		resetMockData();
	}
};
