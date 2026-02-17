import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../providers";

type RequireAuthProps = {
	children: React.ReactElement;
};

export function RequireAuth({ children }: RequireAuthProps) {
	const location = useLocation();
	const { isAuthenticated } = useAuth();

	if (!isAuthenticated) {
		return <Navigate to="/login" replace state={{ from: location }} />;
	}

	return children;
}
