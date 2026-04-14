import React, { useMemo } from "react";

import type { GatheringItem } from "#/apis/gatherings";

type DailyCreationChartProps = {
	gatherings: GatheringItem[];
};

export function DailyCreationChart({ gatherings }: DailyCreationChartProps) {
	const days = useMemo(() => {
		const result: Array<{ key: string; label: string; count: number }> = [];
		const today = new Date();
		today.setHours(0, 0, 0, 0);

		for (let i = 13; i >= 0; i--) {
			const d = new Date(today);
			d.setDate(today.getDate() - i);
			const key = d.toISOString().slice(0, 10);
			const mm = String(d.getMonth() + 1).padStart(2, "0");
			const dd = String(d.getDate()).padStart(2, "0");
			result.push({ key, label: `${mm}/${dd}`, count: 0 });
		}

		for (const gathering of gatherings) {
			const key = gathering.createdAt.slice(0, 10);
			const day = result.find((d) => d.key === key);
			if (day) {
				day.count += 1;
			}
		}

		return result;
	}, [gatherings]);

	const maxCount = Math.max(...days.map((d) => d.count), 1);

	return (
		<div className="admin-daily-chart">
			<div className="admin-daily-chart__bars">
				{days.map(({ key, label, count }) => (
					<div className="admin-daily-chart__col" key={key}>
						<span className="admin-daily-chart__value">
							{count}
						</span>
						<div className="admin-daily-chart__track">
							{count > 0 && (
								<div
									className="admin-daily-chart__bar"
									style={{
										height: `${(count / maxCount) * 100}%`,
									}}
								/>
							)}
						</div>
						<span className="admin-daily-chart__label">{label}</span>
					</div>
				))}
			</div>
		</div>
	);
}
