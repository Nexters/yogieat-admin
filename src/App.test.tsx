import { render, screen } from "@testing-library/react";
import React from "react";

import { resetAdminMockData } from "#/apis/admin";
import App from "#/App";
import { AUTH_STORAGE_KEYS } from "#/providers";

beforeEach(() => {
	window.localStorage.clear();
	resetAdminMockData();
});

test("renders login heading", () => {
	window.history.pushState({}, "", "/");
	render(<App />);
	const headingElement = screen.getByRole("heading", {
		name: /로그인/i,
	});
	expect(headingElement).toBeInTheDocument();
});

test("renders design system page on /design-system", () => {
	window.history.pushState({}, "", "/design-system");
	render(<App />);
	const headingElement = screen.getByRole("heading", {
		name: /yogieat admin dashboard/i,
	});
	expect(headingElement).toBeInTheDocument();
});

test("redirects unauthenticated user from /restaurants to /login", () => {
	window.history.pushState({}, "", "/restaurants");
	render(<App />);
	const headingElement = screen.getByRole("heading", {
		name: /로그인/i,
	});
	expect(headingElement).toBeInTheDocument();
});

test("redirects unauthenticated user from /gatherings to /login", () => {
	window.history.pushState({}, "", "/gatherings");
	render(<App />);
	const headingElement = screen.getByRole("heading", {
		name: /로그인/i,
	});
	expect(headingElement).toBeInTheDocument();
});

test("renders login on /login even when authenticated", async () => {
	window.localStorage.setItem(
		AUTH_STORAGE_KEYS.ACCESS_TOKEN_KEY,
		"test-token",
	);
	window.localStorage.setItem(
		AUTH_STORAGE_KEYS.REFRESH_TOKEN_KEY,
		"test-refresh-token",
	);
	window.localStorage.setItem(
		AUTH_STORAGE_KEYS.SESSION_KEY,
		JSON.stringify({
			adminId: "admin-1",
			name: "Yogieat Admin",
			roles: ["ADMIN"],
			tokenBundle: {
				accessToken: "test-token",
				refreshToken: "test-refresh-token",
				expiresAt: "2099-01-01T00:00:00.000Z",
			},
		}),
	);
	window.history.pushState({}, "", "/login");
	render(<App />);

	const headingElement = await screen.findByRole("heading", {
		name: /로그인/i,
	});
	expect(headingElement).toBeInTheDocument();
});

test("renders gathering list for authenticated user", async () => {
	window.localStorage.setItem(
		AUTH_STORAGE_KEYS.ACCESS_TOKEN_KEY,
		"test-token",
	);
	window.localStorage.setItem(
		AUTH_STORAGE_KEYS.REFRESH_TOKEN_KEY,
		"test-refresh-token",
	);
	window.localStorage.setItem(
		AUTH_STORAGE_KEYS.SESSION_KEY,
		JSON.stringify({
			adminId: "admin-1",
			name: "Yogieat Admin",
			roles: ["ADMIN"],
			tokenBundle: {
				accessToken: "test-token",
				refreshToken: "test-refresh-token",
				expiresAt: "2099-01-01T00:00:00.000Z",
			},
		}),
	);
	window.history.pushState({}, "", "/gatherings");
	render(<App />);

	const headingElement = await screen.findByRole("heading", {
		name: /모임 리스트/i,
	});
	expect(headingElement).toBeInTheDocument();
});

test("renders gathering dashboard page for authenticated user", async () => {
	window.localStorage.setItem(
		AUTH_STORAGE_KEYS.ACCESS_TOKEN_KEY,
		"test-token",
	);
	window.localStorage.setItem(
		AUTH_STORAGE_KEYS.REFRESH_TOKEN_KEY,
		"test-refresh-token",
	);
	window.localStorage.setItem(
		AUTH_STORAGE_KEYS.SESSION_KEY,
		JSON.stringify({
			adminId: "admin-1",
			name: "Yogieat Admin",
			roles: ["ADMIN"],
			tokenBundle: {
				accessToken: "test-token",
				refreshToken: "test-refresh-token",
				expiresAt: "2099-01-01T00:00:00.000Z",
			},
		}),
	);
	window.history.pushState({}, "", "/gatherings/dashboard");
	render(<App />);

	const headingElement = await screen.findByRole("heading", {
		name: /모임\/참여자 대시보드/i,
	});
	expect(headingElement).toBeInTheDocument();
});
