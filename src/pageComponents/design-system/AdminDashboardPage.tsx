import React from "react";

import {
	ARROW_ICON_NAMES,
	GENERAL_ICON_NAMES,
	BarGraph,
	BottomSheet,
	Button,
	CardCompact,
	CardLarge,
	Chip,
	FoodIllustration,
	Header,
	Icon,
	ListSection,
	OpinionSummarySection,
	SelectButton,
	SelectCheckItem,
	Spinner,
	StepIndicator,
	SystemIllustration,
	Tag,
	TextField,
	Toast,
} from "#/shared/ui";

const FOOD_ITEMS: Array<{
	key: Parameters<typeof FoodIllustration>[0]["type"];
	label: string;
}> = [
	{ key: "kr", label: "한식" },
	{ key: "jp", label: "일식" },
	{ key: "cn", label: "중식" },
	{ key: "fr", label: "양식" },
	{ key: "vt", label: "아시안" },
	{ key: "whatever", label: "상관없음" },
];

export function AdminDashboardPage() {
	return (
		<main className="dashboard-page">
			<h1 className="dashboard-title">Yogieat Admin Dashboard</h1>

			<section className="ds-section">
				<h2>Chip</h2>
				<div className="ds-grid ds-grid--six">
					<Chip tone="unselected">Text</Chip>
					<Chip tone="unselected" state="hover">
						Text
					</Chip>
					<Chip tone="unselected" state="disabled">
						Text
					</Chip>
					<Chip tone="selected">Text</Chip>
					<Chip tone="selected" state="hover">
						Text
					</Chip>
					<Chip tone="selected" state="disabled">
						Text
					</Chip>
				</div>
			</section>

			<section className="ds-section">
				<h2>Button</h2>
				<div className="ds-button-showcase">
					<Button variant="primary">Text</Button>
					<Button variant="primary" loading>
						Text
					</Button>
					<Button variant="secondary">Text</Button>
					<Button variant="secondary" loading>
						Text
					</Button>
					<Button variant="tertiary">Text</Button>
					<Button variant="tertiary" loading>
						Text
					</Button>
					<Button variant="primary" shape="pill">
						Text
					</Button>
				</div>
			</section>

			<section className="ds-section">
				<h2>Input</h2>
				<div className="ds-input-grid">
					<TextField kind="standard" state="default" />
					<TextField kind="standard" state="focus" />
					<TextField kind="standard" state="typing" cancel />
					<TextField
						kind="standard"
						state="filled"
						value="Placeholder"
					/>
					<TextField kind="standard" state="disabled" />
					<TextField kind="standard" state="error" cancel />
					<TextField kind="search" state="default" />
					<TextField kind="search" state="focus" />
					<TextField kind="search" state="typing" cancel />
					<TextField
						kind="search"
						state="filled"
						value="Placeholder"
					/>
					<TextField kind="search" state="disabled" />
					<TextField kind="search" state="error" cancel />
				</div>
			</section>

			<section className="ds-section">
				<h2>Header</h2>
				<div className="ds-header-stack">
					<Header mode="none" />
					<Header mode="back" />
					<Header
						mode="text"
						title="Title"
						description="Description"
					/>
					<Header mode="logo" />
				</div>
			</section>

			<section className="ds-section">
				<h2>Illustration</h2>
				<div className="ds-grid ds-grid--food">
					{FOOD_ITEMS.map(({ key, label }) => (
						<div key={key} className="ds-illustration-item">
							<FoodIllustration type={key} />
							<span>{label}</span>
						</div>
					))}
					<div className="ds-illustration-item">
						<FoodIllustration type="subway" />
						<span>지하철</span>
					</div>
					<div className="ds-illustration-item">
						<FoodIllustration type="shoe" />
						<span>운동화</span>
					</div>
				</div>
				<div className="ds-grid ds-grid--system">
					<SystemIllustration type="heart" />
					<SystemIllustration type="exclamation" />
					<SystemIllustration type="star" />
					<SystemIllustration type="good" />
					<SystemIllustration type="bad" />
				</div>
			</section>

			<section className="ds-section">
				<h2>Select</h2>
				<div className="ds-select-grid">
					<SelectButton type="kr" label="한식" state="selected" />
					<SelectButton type="jp" label="일식" state="unselected" />
					<SelectButton type="cn" label="중식" state="unselected" />
					<SelectButton type="fr" label="양식" state="unselected" />
					<SelectButton type="vt" label="아시안" state="unselected" />
					<SelectButton
						type="whatever"
						label="상관없음"
						state="unselected"
					/>
				</div>
				<div className="ds-check-row">
					<SelectCheckItem label="상관없음" state="selected" />
					<SelectCheckItem label="상관없음" state="unselected" />
					<SelectCheckItem label="상관없음" state="disabled" />
				</div>
			</section>

			<section className="ds-section">
				<h2>Tag</h2>
				<div className="ds-inline-row">
					<Tag size="medium">Text</Tag>
					<Tag size="small">Text</Tag>
				</div>
			</section>

			<section className="ds-section">
				<h2>Progress</h2>
				<div className="ds-progress-grid">
					<div className="ds-inline-row">
						<StepIndicator current={1} total={3} />
					</div>
					<div className="ds-inline-row">
						<Spinner size="sm" />
						<Spinner size="md" />
						<Spinner size="lg" />
					</div>
					<div className="ds-progress-row">
						<BarGraph value={1} />
						<BarGraph value={50} />
						<BarGraph value={100} />
					</div>
					<BarGraph value={50} label="4명 중 2명이 제출했어요" />
				</div>
			</section>

			<section className="ds-section">
				<h2>Bottom Sheet</h2>
				<div className="ds-center-panel">
					<BottomSheet />
				</div>
			</section>

			<section className="ds-section">
				<h2>Toast</h2>
				<div className="ds-center-panel">
					<Toast message="이미 선택되었어요. 다른 메뉴를 골라주세요!" />
				</div>
			</section>

			<section className="ds-section">
				<h2>Card</h2>
				<div className="ds-card-stack">
					<CardCompact title="Title" ratingText="0.0" />
					<CardLarge title="Title" ratingText="4.2 (323)" />
				</div>
			</section>

			<section className="ds-section">
				<h2>Section</h2>
				<div className="ds-section-showcase">
					<OpinionSummarySection />
					<ListSection />
				</div>
			</section>

			<section className="ds-section ds-section--icon">
				<h2>Icon</h2>
				<div className="ds-icon-board">
					<div>
						<h3>Arrows</h3>
						<div className="ds-icon-grid">
							{ARROW_ICON_NAMES.map((name) => (
								<div key={name} className="ds-icon-cell">
									<Icon name={name} />
									<span>{name}</span>
								</div>
							))}
						</div>
					</div>
					<div>
						<h3>General</h3>
						<div className="ds-icon-grid">
							{GENERAL_ICON_NAMES.map((name) => (
								<div key={name} className="ds-icon-cell">
									<Icon name={name} />
									<span>{name}</span>
								</div>
							))}
						</div>
					</div>
				</div>
			</section>
		</main>
	);
}
