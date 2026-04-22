import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { RequireAuth } from "#/app/guards/RequireAuth";
import {
	AdminDashboardPage,
	GatheringDashboardPage,
	GatheringDetailPage,
	GatheringListPage,
	LoginPage,
	RegionDashboardPage,
	RestaurantDetailPage,
	RestaurantListPage,
} from "#/pageComponents";
import { useAuth } from "#/providers";

function RootRedirect() {
	return <Navigate to="/login" replace />;
}

function FallbackRedirect() {
	const { isAuthenticated } = useAuth();
	return (
		<Navigate to={isAuthenticated ? "/restaurants" : "/login"} replace />
	);
}

export function AppRoutes() {
	return (
		<BrowserRouter
			future={{
				v7_startTransition: true,
				v7_relativeSplatPath: true,
			}}
		>
			<Routes>
				<Route path="/" element={<RootRedirect />} />
				<Route path="/login" element={<LoginPage />} />
				<Route path="/design-system" element={<AdminDashboardPage />} />
				<Route
					path="/gatherings"
					element={
						<RequireAuth>
							<GatheringListPage />
						</RequireAuth>
					}
				/>
				<Route
					path="/gatherings/dashboard"
					element={
						<RequireAuth>
							<GatheringDashboardPage />
						</RequireAuth>
					}
				/>
				<Route
					path="/gatherings/:gatheringId"
					element={
						<RequireAuth>
							<GatheringDetailPage />
						</RequireAuth>
					}
				/>
				<Route
					path="/restaurants"
					element={
						<RequireAuth>
							<RestaurantListPage />
						</RequireAuth>
					}
				/>
				<Route
					path="/restaurants/:restaurantId"
					element={
						<RequireAuth>
							<RestaurantDetailPage />
						</RequireAuth>
					}
				/>
				<Route
					path="/regions"
					element={
						<RequireAuth>
							<RegionDashboardPage />
						</RequireAuth>
					}
				/>
				<Route path="*" element={<FallbackRedirect />} />
			</Routes>
		</BrowserRouter>
	);
}
