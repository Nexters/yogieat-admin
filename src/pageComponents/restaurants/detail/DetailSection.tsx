import type { ReactNode } from "react";

type DetailSectionProps = {
	children: ReactNode;
	description: string;
	title: string;
};

export function DetailSection({
	children,
	description,
	title,
}: DetailSectionProps) {
	return (
		<section className="admin-detail-section">
			<header className="admin-detail-section__header">
				<h2>{title}</h2>
				<p>{description}</p>
			</header>
			{children}
		</section>
	);
}
