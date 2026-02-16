import React from "react";

export type TextFieldKind = "standard" | "search";
export type TextFieldState =
	| "default"
	| "focus"
	| "typing"
	| "filled"
	| "disabled"
	| "error";

type TextFieldProps = {
	cancel?: boolean;
	helperText?: string;
	kind?: TextFieldKind;
	state?: TextFieldState;
	value?: string;
};

export function TextField({
	cancel = false,
	helperText = "Helper text",
	kind = "standard",
	state = "default",
	value,
}: TextFieldProps) {
	const showSearchIcon = kind === "search";
	const showCancel = cancel && (state === "typing" || state === "error");
	const isError = state === "error";
	const isDisabled = state === "disabled";
	const isActive = state === "focus" || state === "typing";

	const displayText =
		value ??
		(state === "typing"
			? "Input"
			: state === "error"
				? "Invalid text"
				: "Placeholder");

	return (
		<div className="ui-text-field">
			<label
				className={[
					"ui-text-field__control",
					isActive ? "ui-text-field__control--active" : "",
					isDisabled ? "ui-text-field__control--disabled" : "",
					isError ? "ui-text-field__control--error" : "",
				]
					.filter(Boolean)
					.join(" ")}
			>
				{showSearchIcon ? (
					<span className="ui-text-field__icon" aria-hidden>
						⌕
					</span>
				) : null}
				<span
					className={[
						"ui-text-field__value",
						state === "default" || state === "focus"
							? "ui-text-field__value--placeholder"
							: "",
						isDisabled ? "ui-text-field__value--disabled" : "",
					].join(" ")}
				>
					{displayText}
					{isActive ? (
						<span className="ui-text-field__cursor" />
					) : null}
				</span>
				{showCancel ? (
					<span className="ui-text-field__cancel" aria-hidden>
						×
					</span>
				) : null}
			</label>
			<p
				className={
					isError
						? "ui-text-field__helper ui-text-field__helper--error"
						: "ui-text-field__helper"
				}
			>
				{helperText}
			</p>
		</div>
	);
}
