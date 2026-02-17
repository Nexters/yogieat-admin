import { adminService } from "#/apis/admin";
import type { AdminSession, LoginRequest } from "#/apis/auth/type";

export const login = (request: LoginRequest): Promise<AdminSession> => {
	return adminService.login(request);
};

export const logout = (): Promise<void> => {
	return adminService.logout();
};
