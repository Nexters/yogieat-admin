import React from "react";
import { FoodIllustration, FoodIllustrationType } from "./illustration";

type SelectButtonState = "selected" | "unselected" | "disabled";

type SelectButtonProps = {
	label: string;
	state?: SelectButtonState;
	type: FoodIllustrationType;
};

export function SelectButton({
	label,
	state = "unselected",
	type,
}: SelectButtonProps) {
	const classes = ["ui-select-button", `ui-select-button--${state}`].join(
		" ",
	);

	return (
		<div className={classes}>
			<div className="ui-select-button__visual">
				<FoodIllustration type={type} />
				{state === "selected" ? (
					<span className="ui-select-button__close">×</span>
				) : null}
			</div>
			<p className="ui-select-button__label">{label}</p>
		</div>
	);
}

export function SelectCheckItem({
	label,
	state = "unselected",
}: {
	label: string;
	state?: SelectButtonState;
}) {
	return (
		<div className={`ui-select-check ui-select-check--${state}`}>
			<span className="ui-select-check__icon">✓</span>
			<span>{label}</span>
		</div>
	);
}
