import React from "react";

type HeaderMode = "none" | "back" | "text" | "logo";

type HeaderProps = {
	description?: string;
	mode?: HeaderMode;
	showIndicator?: boolean;
	title?: string;
};

export function Header({
	description = "Description",
	mode = "text",
	showIndicator = true,
	title = "Title",
}: HeaderProps) {
	if (mode === "none") {
		return <header className="ui-header ui-header--none" />;
	}

	if (mode === "back") {
		return (
			<header className="ui-header ui-header--back">
				<button
					type="button"
					className="ui-header__back"
					aria-label="Back"
				>
					←
				</button>
			</header>
		);
	}

	if (mode === "logo") {
		return (
			<header className="ui-header ui-header--logo">
				<div className="ui-header__brand">요기잇</div>
				<p className="ui-header__logo-copy">메뉴 고르기 어려우시죠?</p>
				<p className="ui-header__logo-copy">취향만 입력해 주세요</p>
				<span className="ui-header__badge">
					2025년 08월 23일 추천 메뉴
				</span>
			</header>
		);
	}

	return (
		<header className="ui-header ui-header--text">
			<button type="button" className="ui-header__back" aria-label="Back">
				←
			</button>
			{showIndicator ? (
				<div className="ui-header__indicator">1/3</div>
			) : null}
			<h3 className="ui-header__title">{title}</h3>
			<p className="ui-header__description">{description}</p>
		</header>
	);
}
