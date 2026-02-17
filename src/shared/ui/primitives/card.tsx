import React from "react";

import { SystemIllustration } from "#/shared/ui/primitives/illustration";
import { Tag } from "#/shared/ui/primitives/tag";

const CARD_IMAGE = "/images/result/restaurant-image-placeholder.png";

type BaseCardProps = {
	tags?: string[];
	title: string;
	ratingText: string;
};

export function CardCompact({
	title,
	ratingText,
	tags = ["Text", "Text"],
}: BaseCardProps) {
	return (
		<article className="ui-card ui-card--compact">
			<img src={CARD_IMAGE} alt="restaurant" className="ui-card__thumb" />
			<div className="ui-card__content">
				<div className="ui-card__title-row">
					<h4>{title}</h4>
					<span>›</span>
				</div>
				<div className="ui-card__rating">
					<SystemIllustration type="star" />
					<span>{ratingText}</span>
				</div>
				<div className="ui-card__tags">
					{tags.map((tag, index) => (
						<Tag key={`${tag}-${index}`}>{tag}</Tag>
					))}
				</div>
			</div>
		</article>
	);
}

export function CardLarge({
	title,
	ratingText,
	tags = ["Text", "Text"],
}: BaseCardProps) {
	return (
		<article className="ui-card ui-card--large">
			<img src={CARD_IMAGE} alt="restaurant" className="ui-card__cover" />
			<div className="ui-card__content ui-card__content--large">
				<div className="ui-card__title-row">
					<h4>{title}</h4>
					<span>›</span>
				</div>
				<div className="ui-card__rating">
					<SystemIllustration type="star" />
					<span>{ratingText}</span>
				</div>
				<div className="ui-card__tags">
					{tags.map((tag, index) => (
						<Tag key={`${tag}-${index}`}>{tag}</Tag>
					))}
				</div>
			</div>
		</article>
	);
}

export function CardList({ title }: { title: string }) {
	return (
		<section className="ui-card-list">
			<h4>{title}</h4>
			<div className="ui-card-list__items">
				<CardCompact title="Title" ratingText="0.0" />
				<CardCompact title="Title" ratingText="0.0" />
			</div>
		</section>
	);
}
