import React from "react";

import type { GatheringItem } from "#/apis/gatherings";
import { CountBars } from "#/pageComponents/gatherings/dashboard/components";
import {
	formatDate,
	resolveGatheringLabel,
} from "#/pageComponents/gatherings/dashboard/constants";
import {
	toRegionLabel,
	toTimeSlotLabel,
} from "#/shared/constants/domain-labels";

type ScheduleSectionProps = {
	gatherings: GatheringItem[];
	participantCountByGathering: Record<number, number>;
	regionCounts: Array<[string, number]>;
	sectionRef: (node: HTMLElement | null) => void;
	timeSlotCounts: Array<[string, number]>;
};

export function ScheduleSection({
	gatherings,
	participantCountByGathering,
	regionCounts,
	sectionRef,
	timeSlotCounts,
}: ScheduleSectionProps) {
	return (
		<section ref={sectionRef} className="admin-panel admin-insight-section">
			<h2>일정 트렌드</h2>
			<div className="admin-insight-grid">
				<article className="admin-insight-card">
					<h3>지역 분포</h3>
					<CountBars rows={regionCounts} />
				</article>
				<article className="admin-insight-card">
					<h3>시간대 분포</h3>
					<CountBars rows={timeSlotCounts} />
				</article>
			</div>
			<div className="admin-insight-table-wrap">
				<table className="admin-insight-table">
					<thead>
						<tr>
							<th>모임</th>
							<th>예정일</th>
							<th>지역</th>
							<th>시간대</th>
							<th>정원</th>
							<th>참여자</th>
						</tr>
					</thead>
					<tbody>
						{gatherings.map((gathering) => {
							const linkedParticipantCount =
								participantCountByGathering[gathering.id] ?? 0;
							return (
								<tr key={gathering.id}>
									<td>{resolveGatheringLabel(gathering)}</td>
									<td>
										{formatDate(gathering.scheduledDate)}
									</td>
									<td>{toRegionLabel(gathering.region)}</td>
									<td>{toTimeSlotLabel(gathering.timeSlot)}</td>
									<td>{gathering.peopleCount}</td>
									<td>{linkedParticipantCount}</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
		</section>
	);
}
