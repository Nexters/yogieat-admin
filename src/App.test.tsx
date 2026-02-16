import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

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
