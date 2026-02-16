import React from "react";

export function StepIndicator({
	current = 1,
	total = 3,
}: {
	current?: number;
	total?: number;
}) {
	return <span className="ui-step-indicator">{`${current}/${total}`}</span>;
}

export function Spinner({ size = "sm" }: { size?: "sm" | "md" | "lg" }) {
	return (
		<span
			className={`ui-spinner ui-spinner--${size}`}
			aria-label="loading"
		/>
	);
}

export function BarGraph({
	value = 50,
	label,
}: {
	value?: number;
	label?: string;
}) {
	const safe = Math.min(100, Math.max(0, value));
	return (
		<div className="ui-progress-wrap">
			{label ? (
				<div className="ui-progress-wrap__header">
					<strong>{label}</strong>
					<span>{`${safe}%`}</span>
				</div>
			) : null}
			<div className="ui-progress-track">
				<div
					className="ui-progress-fill"
					style={{ width: `${safe}%` }}
				/>
				<span
					className="ui-progress-thumb"
					style={{ left: `${safe}%` }}
				>
					<span>♥</span>
				</span>
			</div>
		</div>
	);
}
