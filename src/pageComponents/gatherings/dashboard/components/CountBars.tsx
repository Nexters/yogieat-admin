import React from "react";

type CountBarsProps = {
	rows: Array<[string, number]>;
};

export function CountBars({ rows }: CountBarsProps) {
	const maxCount = rows.reduce((max, [, count]) => Math.max(max, count), 0);

	return (
		<div className="admin-insight-bars">
			{rows.length === 0 ? (
				<p className="admin-insight-empty">데이터가 없습니다.</p>
			) : null}
			{rows.map(([label, count]) => (
				<div className="admin-insight-bars__row" key={label}>
					<span>{label}</span>
					<div className="admin-insight-bars__track">
						<span
							style={{
								width: `${
									maxCount > 0 ? (count / maxCount) * 100 : 0
								}%`,
							}}
						/>
					</div>
					<strong>{count}</strong>
				</div>
			))}
		</div>
	);
}
