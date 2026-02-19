import React from "react";

import { CardList } from "#/shared/ui/primitives/card";
import { BarGraph } from "#/shared/ui/primitives/progress";
import { SelectCheckItem } from "#/shared/ui/primitives/SelectButton";
import { Tag } from "#/shared/ui/primitives/tag";

function VoteRow({
	label,
	votes,
}: {
	label: string;
	votes: Array<{ name: string; value: string }>;
}) {
	return (
		<div className="ui-opinion-row">
			<SelectCheckItem
				label={label}
				state={label.includes("좋아") ? "selected" : "unselected"}
			/>
			<div className="ui-opinion-row__votes">
				{votes.map((vote) => (
					<div
						key={`${label}-${vote.name}`}
						className="ui-opinion-row__vote"
					>
						<span>{vote.name}</span>
						<Tag size="small">{vote.value}</Tag>
					</div>
				))}
			</div>
		</div>
	);
}

export function OpinionSummarySection() {
	return (
		<section className="ui-opinion-summary">
			<BarGraph value={50} label="의견 일치율" />
			<hr />
			<div className="ui-opinion-summary__list">
				<VoteRow
					label="좋아하는 음식"
					votes={[
						{ name: "한식", value: "3표" },
						{ name: "아시아식", value: "2표" },
						{ name: "일식", value: "1표" },
					]}
				/>
				<VoteRow
					label="피하고 싶은 음식"
					votes={[
						{ name: "한식", value: "3표" },
						{ name: "아시아식", value: "2표" },
						{ name: "일식", value: "1표" },
					]}
				/>
			</div>
		</section>
	);
}

export function ListSection() {
	return <CardList title="Title" />;
}
