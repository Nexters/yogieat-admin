import { adminService, setAdminServiceMode } from "#/apis/admin";
import { localAdminService } from "#/apis/admin/LocalAdminService";
import type { AdminSession, LoginRequest } from "#/apis/auth/type";

const isMockCredential = (request: LoginRequest): boolean => {
	return request.loginId === "admin" && request.password === "admin1234";
};

export const login = (request: LoginRequest): Promise<AdminSession> => {
	if (isMockCredential(request)) {
		setAdminServiceMode("mock");
		return localAdminService.login(request);
	}

	setAdminServiceMode("real");
	return adminService.login(request);
};

export const logout = (): Promise<void> => {
	return adminService.logout();
};
