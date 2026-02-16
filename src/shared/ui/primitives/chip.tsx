import React from "react";

type ChipTone = "selected" | "unselected";
type ChipState = "default" | "hover" | "disabled";

type ChipProps = {
	children: React.ReactNode;
	state?: ChipState;
	tone?: ChipTone;
};

export function Chip({
	children,
	state = "default",
	tone = "unselected",
}: ChipProps) {
	const className = [
		"ui-chip",
		`ui-chip--${tone}`,
		state !== "default" ? `ui-chip--${state}` : "",
	]
		.filter(Boolean)
		.join(" ");

	return <span className={className}>{children}</span>;
}
