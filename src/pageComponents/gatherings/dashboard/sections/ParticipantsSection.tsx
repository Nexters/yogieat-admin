import React from "react";

import type { GatheringItem, ParticipantItem } from "#/apis/gatherings";
import { resolveGatheringLabel } from "#/pageComponents/gatherings/dashboard/constants";

type ParticipantsSectionProps = {
	gatheringById: Record<number, GatheringItem>;
	participants: ParticipantItem[];
	sectionRef: (node: HTMLElement | null) => void;
};

export function ParticipantsSection({
	gatheringById,
	participants,
	sectionRef,
}: ParticipantsSectionProps) {
	return (
		<section ref={sectionRef} className="admin-panel admin-insight-section">
			<h2>참여자</h2>
			<div className="admin-insight-table-wrap">
				<table className="admin-insight-table">
					<thead>
						<tr>
							<th>ID</th>
							<th>닉네임</th>
							<th>역할</th>
							<th>연결 모임</th>
							<th>거리 범위</th>
							<th>선호 카테고리</th>
							<th>비선호</th>
						</tr>
					</thead>
					<tbody>
						{participants.map((participant) => {
							const linkedGathering =
								typeof participant.gatheringId === "number"
									? gatheringById[participant.gatheringId]
									: undefined;

							return (
								<tr key={participant.id}>
									<td>{participant.id}</td>
									<td>{participant.nickname}</td>
									<td>{participant.role}</td>
									<td>
										{linkedGathering
											? resolveGatheringLabel(
													linkedGathering,
												)
											: `연결 없음 (#${
													participant.gatheringId ??
													"-"
												})`}
									</td>
									<td>{participant.distanceRange}</td>
									<td>
										{participant.preferences.join(", ")}
									</td>
									<td>{participant.dislikes}</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
		</section>
	);
}
