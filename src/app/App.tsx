import React from "react";
import { AdminDashboardPage } from "../pages/admin-dashboard-page";
import { LoginPage } from "../pages/login-page";
import { AppProviders } from "../providers";

function App() {
	const pathname =
		typeof window !== "undefined" ? window.location.pathname : "/";
	const isDesignSystemPage = pathname === "/design-system";

	return (
		<AppProviders>
			{isDesignSystemPage ? <AdminDashboardPage /> : <LoginPage />}
		</AppProviders>
	);
}

export default App;
