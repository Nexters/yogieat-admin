import React from "react";

export type FoodIllustrationType =
	| "kr"
	| "jp"
	| "fr"
	| "cn"
	| "vt"
	| "whatever"
	| "subway"
	| "shoe";

export type SystemIllustrationType =
	| "heart"
	| "exclamation"
	| "star"
	| "good"
	| "bad";

const FOOD_ILLUST: Record<FoodIllustrationType, string> = {
	kr: "/images/foodCategory/korean.svg",
	jp: "/images/foodCategory/japanese.svg",
	fr: "/images/foodCategory/western.svg",
	cn: "/images/foodCategory/chinese.svg",
	vt: "/images/foodCategory/asian.svg",
	whatever: "/images/foodCategory/any.svg",
	subway: "/images/foodCategory/any.svg",
	shoe: "/images/foodCategory/any.svg",
};

const SYSTEM_GLYPH: Record<SystemIllustrationType, string> = {
	heart: "♥",
	exclamation: "!",
	star: "★",
	good: "✓",
	bad: "×",
};

export function FoodIllustration({ type }: { type: FoodIllustrationType }) {
	return (
		<img
			className="ui-illustration ui-illustration--food"
			src={FOOD_ILLUST[type]}
			alt={type}
			loading="lazy"
		/>
	);
}

export function SystemIllustration({ type }: { type: SystemIllustrationType }) {
	return (
		<span
			className={`ui-illustration-system ui-illustration-system--${type}`}
			aria-label={type}
			title={type}
		>
			<span className="ui-illustration-system__glyph">
				{SYSTEM_GLYPH[type]}
			</span>
		</span>
	);
}
