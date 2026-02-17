import React from "react";

import { CountBars } from "#/pageComponents/gatherings/dashboard/components";

type InterestsSectionProps = {
	dislikeCounts: Array<[string, number]>;
	distanceCounts: Array<[string, number]>;
	preferenceCounts: Array<[string, number]>;
	sectionRef: (node: HTMLElement | null) => void;
};

export function InterestsSection({
	dislikeCounts,
	distanceCounts,
	preferenceCounts,
	sectionRef,
}: InterestsSectionProps) {
	return (
		<section ref={sectionRef} className="admin-panel admin-insight-section">
			<h2>관심사</h2>
			<div className="admin-insight-grid">
				<article className="admin-insight-card">
					<h3>선호 카테고리</h3>
					<CountBars rows={preferenceCounts} />
				</article>
				<article className="admin-insight-card">
					<h3>비선호 카테고리</h3>
					<CountBars rows={dislikeCounts} />
				</article>
				<article className="admin-insight-card">
					<h3>거리 선호</h3>
					<CountBars rows={distanceCounts} />
				</article>
			</div>
		</section>
	);
}
