import type { ReactNode } from "react";

type DetailFieldProps = {
	children: ReactNode;
	className?: string;
	label: string;
};

export function DetailField({ children, className, label }: DetailFieldProps) {
	return (
		<label className={`admin-field${className ? ` ${className}` : ""}`}>
			<span>{label}</span>
			{children}
		</label>
	);
}
