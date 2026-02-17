import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../shared/ui";

type NotFoundPageProps = {
	description?: string;
	title?: string;
	actionLabel?: string;
	actionTo?: string;
};

export function NotFoundPage({
	description = "요청한 리소스를 찾을 수 없습니다.",
	title = "페이지를 찾을 수 없습니다.",
	actionLabel = "목록으로 이동",
	actionTo = "/restaurants",
}: NotFoundPageProps) {
	return (
		<main className="admin-shell">
			<section className="admin-panel admin-panel--status">
				<h1>{title}</h1>
				<p>{description}</p>
				<Button asChild size="sm" variant="secondary">
					<Link to={actionTo}>{actionLabel}</Link>
				</Button>
			</section>
		</main>
	);
}
