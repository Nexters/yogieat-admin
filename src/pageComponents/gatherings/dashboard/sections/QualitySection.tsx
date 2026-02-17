import React from "react";

import type { DataIssue } from "#/apis/gatherings";
import { toIssueClassName } from "#/pageComponents/gatherings/dashboard/constants";

type QualitySectionProps = {
	issues: DataIssue[];
	sectionRef: (node: HTMLElement | null) => void;
};

export function QualitySection({ issues, sectionRef }: QualitySectionProps) {
	return (
		<section ref={sectionRef} className="admin-panel admin-insight-section">
			<h2>데이터 품질</h2>
			<ul className="admin-issue-list">
				{issues.map((issue) => (
					<li key={issue.id} className="admin-issue-item">
						<div className={toIssueClassName(issue.severity)}>
							{issue.severity}
						</div>
						<div className="admin-issue-item__content">
							<p>{issue.title}</p>
							<span>{issue.description}</span>
						</div>
					</li>
				))}
			</ul>
		</section>
	);
}
