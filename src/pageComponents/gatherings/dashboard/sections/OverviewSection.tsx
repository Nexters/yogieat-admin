import React from "react";

import type { DashboardMetrics } from "#/pageComponents/gatherings/dashboard/types";

type OverviewSectionProps = {
	metrics: DashboardMetrics;
	sectionRef: (node: HTMLElement | null) => void;
};

export function OverviewSection({ metrics, sectionRef }: OverviewSectionProps) {
	return (
		<section ref={sectionRef} className="admin-panel admin-insight-section">
			<h2>개요</h2>
			<div className="admin-insight-kpis">
				<article className="admin-insight-kpi">
					<span>활성 모임</span>
					<strong>{metrics.activeGatherings}</strong>
				</article>
				<article className="admin-insight-kpi">
					<span>참여자</span>
					<strong>{metrics.participants}</strong>
				</article>
				<article className="admin-insight-kpi">
					<span>14일 내 예정 모임</span>
					<strong>{metrics.upcomingWithin14Days}</strong>
				</article>
				<article className="admin-insight-kpi">
					<span>평균 목표 인원</span>
					<strong>
						{metrics.averageTargetHeadcount.toFixed(1)}명
					</strong>
				</article>
				<article className="admin-insight-kpi">
					<span>정원 대비 참여율</span>
					<strong>
						{metrics.averageParticipantFill.toFixed(1)}%
					</strong>
				</article>
			</div>
		</section>
	);
}
