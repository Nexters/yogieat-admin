import { Slot } from "@radix-ui/react-slot";
import React, { ButtonHTMLAttributes, forwardRef } from "react";

type ButtonVariant = "primary" | "secondary" | "tertiary" | "inverse";
type ButtonSize = "sm" | "md" | "lg";
type ButtonShape = "rounded" | "pill";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
	asChild?: boolean;
	loading?: boolean;
	shape?: ButtonShape;
	variant?: ButtonVariant;
	size?: ButtonSize;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
	(
		{
			asChild = false,
			className = "",
			disabled,
			loading = false,
			shape = "rounded",
			variant = "secondary",
			size = "md",
			type = "button",
			children,
			...props
		},
		ref,
	) => {
		const Comp = asChild ? Slot : "button";
		const isDisabled = Boolean(disabled || loading);
		const classes = [
			"ui-button",
			`ui-button--${variant}`,
			`ui-button--${size}`,
			shape === "pill" ? "ui-button--pill" : "",
			loading ? "ui-button--loading" : "",
			className,
		]
			.filter(Boolean)
			.join(" ");

		const buttonProps = asChild ? props : { type, ...props };
		const content = asChild ? (
			children
		) : (
			<>
				{loading ? (
					<span className="ui-button__spinner" aria-hidden />
				) : null}
				<span>{children}</span>
			</>
		);
		const disabledProps = asChild
			? { "aria-disabled": isDisabled || undefined }
			: { disabled: isDisabled };

		return (
			<Comp ref={ref} className={classes} {...disabledProps} {...buttonProps}>
				{content}
			</Comp>
		);
	},
);

Button.displayName = "Button";
